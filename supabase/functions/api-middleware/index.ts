
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

interface AuthResult {
  valid: boolean;
  user_id?: string;
  api_key_id?: string;
  subscription_type?: string;
  user_name?: string;
  user_email?: string;
  error?: string;
}

interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  reset_time: string;
  current_usage: number;
}

export async function authenticateRequest(req: Request): Promise<AuthResult> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  const apiKey = req.headers.get('x-api-key') || req.headers.get('authorization')?.replace('Bearer ', '')
  
  if (!apiKey) {
    return { valid: false, error: 'API key required' }
  }

  // Hash the API key for lookup
  const encoder = new TextEncoder()
  const data = encoder.encode(apiKey)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const keyHash = Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')

  try {
    const { data: result, error } = await supabase.rpc('validate_api_key', { p_key_hash: keyHash })
    
    if (error) {
      console.error('API key validation error:', error)
      return { valid: false, error: 'Authentication failed' }
    }

    return result as AuthResult
  } catch (error) {
    console.error('Authentication error:', error)
    return { valid: false, error: 'Authentication failed' }
  }
}

export async function checkRateLimit(userId: string, subscriptionType: string): Promise<RateLimitResult> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    const { data: result, error } = await supabase.rpc('check_rate_limit', {
      p_user_id: userId,
      p_subscription_type: subscriptionType
    })
    
    if (error) {
      console.error('Rate limit check error:', error)
      return { allowed: false, limit: 0, remaining: 0, reset_time: '', current_usage: 0 }
    }

    return result as RateLimitResult
  } catch (error) {
    console.error('Rate limit error:', error)
    return { allowed: false, limit: 0, remaining: 0, reset_time: '', current_usage: 0 }
  }
}

export async function logApiUsage(
  userId: string, 
  apiKeyId: string, 
  endpoint: string, 
  method: string, 
  statusCode: number, 
  responseTimeMs: number,
  req: Request
) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    await supabase.from('api_usage').insert({
      user_id: userId,
      api_key_id: apiKeyId,
      endpoint,
      method,
      status_code: statusCode,
      response_time_ms: responseTimeMs,
      ip_address: req.headers.get('x-forwarded-for') || 'unknown',
      user_agent: req.headers.get('user-agent') || 'unknown'
    })
  } catch (error) {
    console.error('Failed to log API usage:', error)
  }
}

export function createApiResponse(data: any, status: number = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
      ...headers
    }
  })
}

export function createErrorResponse(message: string, status: number = 400) {
  return createApiResponse({ error: message }, status)
}
