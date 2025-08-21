
import { serve } from 'https://deno.land/std@0.190.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
}

async function generateApiKey(): Promise<{ key: string; hash: string; preview: string }> {
  const key = `ak_${crypto.randomUUID().replace(/-/g, '')}`
  
  const encoder = new TextEncoder()
  const data = encoder.encode(key)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hash = Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
  
  const preview = key.substring(0, 8) + '...'
  
  return { key, hash, preview }
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
  })

  // Get user from auth header
  const authHeader = req.headers.get('authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Authorization required' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    })
  }

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  
  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    })
  }

  try {
    if (req.method === 'GET') {
      // List user's API keys
      const { data: apiKeys, error } = await supabase
        .from('api_keys')
        .select('id, name, key_preview, is_active, last_used_at, created_at, expires_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch API keys' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        })
      }

      return new Response(JSON.stringify({ data: apiKeys }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }

    if (req.method === 'POST') {
      // Create new API key
      const body = await req.json()
      const name = body.name || 'Default API Key'
      
      const { key, hash, preview } = await generateApiKey()

      const { data: newKey, error } = await supabase
        .from('api_keys')
        .insert({
          user_id: user.id,
          name,
          key_hash: hash,
          key_preview: preview,
          is_active: true
        })
        .select()
        .single()

      if (error) {
        return new Response(JSON.stringify({ error: 'Failed to create API key' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        })
      }

      return new Response(JSON.stringify({
        message: 'API key created successfully',
        api_key: key, // Only returned once!
        key_info: {
          id: newKey.id,
          name: newKey.name,
          preview: newKey.key_preview,
          created_at: newKey.created_at
        }
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }

    if (req.method === 'DELETE') {
      // Delete API key
      const url = new URL(req.url)
      const keyId = url.searchParams.get('id')
      
      if (!keyId) {
        return new Response(JSON.stringify({ error: 'Key ID required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        })
      }

      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', keyId)
        .eq('user_id', user.id)

      if (error) {
        return new Response(JSON.stringify({ error: 'Failed to delete API key' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        })
      }

      return new Response(JSON.stringify({ message: 'API key deleted successfully' }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    })

  } catch (error) {
    console.error('API Keys Management error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    })
  }
})
