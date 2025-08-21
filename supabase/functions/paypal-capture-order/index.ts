
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { orderId } = await req.json()

    const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID')
    const PAYPAL_CLIENT_SECRET = Deno.env.get('PAYPAL_CLIENT_SECRET')
    const PAYPAL_BASE_URL = Deno.env.get('PAYPAL_BASE_URL') || 'https://api-m.sandbox.paypal.com'

    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error('PayPal credentials not configured')
    }

    // Get PayPal access token
    const authResponse = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`)}`,
      },
      body: 'grant_type=client_credentials',
    })

    const authData = await authResponse.json()
    const accessToken = authData.access_token

    // Capture PayPal order
    const captureResponse = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    })

    const captureData = await captureResponse.json()

    if (!captureResponse.ok) {
      throw new Error(`PayPal capture failed: ${captureData.message}`)
    }

    // Update advertisement and record transaction in Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const advertisementId = captureData.purchase_units[0]?.custom_id
    const transactionId = captureData.id
    const amount = parseFloat(captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value || '0')

    if (advertisementId) {
      // Update advertisement status
      await supabaseClient
        .from('business_advertisements')
        .update({
          payment_status: 'paid',
          payment_id: transactionId,
          is_active: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', advertisementId)

      // Record transaction
      await supabaseClient
        .from('payment_transactions')
        .insert({
          advertisement_id: advertisementId,
          payment_provider: 'paypal',
          transaction_id: transactionId,
          amount: amount,
          currency: 'USD',
          status: 'completed',
          payment_details: captureData,
        })
    }

    return new Response(
      JSON.stringify({
        success: true,
        transactionId: transactionId,
        amount: amount,
        status: captureData.status,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('PayPal capture order error:', error)

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
