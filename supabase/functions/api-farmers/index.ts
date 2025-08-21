
import { serve } from 'https://deno.land/std@0.190.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { authenticateRequest, checkRateLimit, logApiUsage, createApiResponse, createErrorResponse } from '../api-middleware/index.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

serve(async (req: Request): Promise<Response> => {
  const startTime = Date.now()
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Authenticate the request
    const auth = await authenticateRequest(req)
    if (!auth.valid) {
      await logApiUsage('', '', '/api/v1/farmers', req.method, 401, Date.now() - startTime, req)
      return createErrorResponse(auth.error || 'Unauthorized', 401)
    }

    // Check rate limits
    const rateLimit = await checkRateLimit(auth.user_id!, auth.subscription_type!)
    if (!rateLimit.allowed) {
      await logApiUsage(auth.user_id!, auth.api_key_id!, '/api/v1/farmers', req.method, 429, Date.now() - startTime, req)
      return createErrorResponse('Rate limit exceeded', 429)
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const url = new URL(req.url)
    const county = url.searchParams.get('county')
    const limit = parseInt(url.searchParams.get('limit') || '50')
    const offset = parseInt(url.searchParams.get('offset') || '0')

    // Build query based on subscription level
    let query = supabase.from('profiles').select(`
      id,
      full_name,
      county,
      contact_number,
      email,
      role,
      created_at
    `).eq('role', 'farmer')

    // Apply subscription-based filters
    if (auth.subscription_type === 'free') {
      // Free tier: Limited data, no contact info
      query = supabase.from('profiles').select(`
        id,
        full_name,
        county,
        created_at
      `).eq('role', 'farmer').limit(10)
    } else if (auth.subscription_type === 'developer') {
      // Developer tier: More data, limited contact info
      query = supabase.from('profiles').select(`
        id,
        full_name,
        county,
        email,
        role,
        created_at
      `).eq('role', 'farmer').limit(100)
    }
    // Enterprise gets full access

    if (county) {
      query = query.ilike('county', `%${county}%`)
    }

    query = query.range(offset, offset + limit - 1)

    const { data: farmers, error } = await query

    if (error) {
      console.error('Database error:', error)
      await logApiUsage(auth.user_id!, auth.api_key_id!, '/api/v1/farmers', req.method, 500, Date.now() - startTime, req)
      return createErrorResponse('Internal server error', 500)
    }

    // Transform data based on subscription
    const transformedData = farmers?.map(farmer => {
      const baseData = {
        id: farmer.id,
        name: farmer.full_name,
        county: farmer.county,
        joinDate: farmer.created_at
      }

      if (auth.subscription_type === 'free') {
        return {
          ...baseData,
          contact: 'Upgrade to Developer tier for contact info'
        }
      }

      if (auth.subscription_type === 'developer') {
        return {
          ...baseData,
          email: farmer.email,
          contact: 'Upgrade to Enterprise for full contact details'
        }
      }

      // Enterprise tier gets everything
      return {
        ...baseData,
        email: farmer.email,
        phone: farmer.contact_number,
        role: farmer.role
      }
    })

    const responseTime = Date.now() - startTime
    await logApiUsage(auth.user_id!, auth.api_key_id!, '/api/v1/farmers', req.method, 200, responseTime, req)

    return createApiResponse({
      data: transformedData,
      meta: {
        count: farmers?.length || 0,
        limit,
        offset,
        subscription_type: auth.subscription_type,
        rate_limit: {
          remaining: rateLimit.remaining,
          limit: rateLimit.limit,
          reset_time: rateLimit.reset_time
        }
      }
    })

  } catch (error) {
    console.error('API error:', error)
    return createErrorResponse('Internal server error', 500)
  }
})
