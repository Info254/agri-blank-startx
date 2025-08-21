
import { serve } from 'https://deno.land/std@0.190.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { authenticateRequest, checkRateLimit, logApiUsage, createApiResponse, createErrorResponse } from '../api-middleware/index.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
}

serve(async (req: Request): Promise<Response> => {
  const startTime = Date.now()
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const auth = await authenticateRequest(req)
    if (!auth.valid) {
      return createErrorResponse(auth.error || 'Unauthorized', 401)
    }

    // Developer tier or higher required for market data
    if (auth.subscription_type === 'free') {
      await logApiUsage(auth.user_id!, auth.api_key_id!, '/api/v1/markets', req.method, 403, Date.now() - startTime, req)
      return createErrorResponse('Developer subscription required for market data access', 403)
    }

    const rateLimit = await checkRateLimit(auth.user_id!, auth.subscription_type!)
    if (!rateLimit.allowed) {
      return createErrorResponse('Rate limit exceeded', 429)
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const url = new URL(req.url)
    const county = url.searchParams.get('county')
    const commodity = url.searchParams.get('commodity')
    const limit = parseInt(url.searchParams.get('limit') || '50')

    let query = supabase.from('market_prices').select(`
      id,
      market_id,
      market_name,
      county,
      commodity_name,
      price,
      unit,
      date_recorded,
      confidence_score,
      verified,
      source
    `).order('date_recorded', { ascending: false })

    if (county) {
      query = query.ilike('county', `%${county}%`)
    }
    if (commodity) {
      query = query.ilike('commodity_name', `%${commodity}%`)
    }

    // Apply subscription limits
    if (auth.subscription_type === 'developer') {
      query = query.limit(Math.min(limit, 200))
    } else {
      query = query.limit(limit)
    }

    const { data: markets, error } = await query

    if (error) {
      console.error('Database error:', error)
      return createErrorResponse('Internal server error', 500)
    }

    // Group by market and get latest prices
    const marketData = markets?.reduce((acc: any, price: any) => {
      const marketKey = `${price.market_id}-${price.county}`
      if (!acc[marketKey]) {
        acc[marketKey] = {
          id: price.market_id,
          name: price.market_name,
          county: price.county,
          prices: []
        }
      }
      acc[marketKey].prices.push({
        commodity: price.commodity_name,
        price: price.price,
        unit: price.unit,
        date: price.date_recorded,
        confidence: price.confidence_score,
        verified: price.verified
      })
      return acc
    }, {})

    const responseTime = Date.now() - startTime
    await logApiUsage(auth.user_id!, auth.api_key_id!, '/api/v1/markets', req.method, 200, responseTime, req)

    return createApiResponse({
      data: Object.values(marketData || {}),
      meta: {
        count: Object.keys(marketData || {}).length,
        subscription_type: auth.subscription_type,
        rate_limit: {
          remaining: rateLimit.remaining,
          limit: rateLimit.limit
        }
      }
    })

  } catch (error) {
    console.error('API error:', error)
    return createErrorResponse('Internal server error', 500)
  }
})
