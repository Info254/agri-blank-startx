
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

    // Enterprise tier required for supply chain analytics
    if (auth.subscription_type !== 'enterprise') {
      await logApiUsage(auth.user_id!, auth.api_key_id!, '/api/v1/supply-chain', req.method, 403, Date.now() - startTime, req)
      return createErrorResponse('Enterprise subscription required for supply chain analytics', 403)
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
    const analysisType = url.searchParams.get('type') || 'overview'

    // Get comprehensive supply chain data
    const [transportersResult, marketPricesResult, forecastsResult] = await Promise.all([
      supabase.from('transporters').select('*').limit(100),
      supabase.from('market_prices').select('*').order('date_recorded', { ascending: false }).limit(200),
      supabase.from('market_forecasts').select('*').limit(50)
    ])

    if (transportersResult.error || marketPricesResult.error || forecastsResult.error) {
      return createErrorResponse('Failed to fetch supply chain data', 500)
    }

    let responseData: any = {}

    switch (analysisType) {
      case 'logistics':
        responseData = {
          transporters: transportersResult.data?.filter(t => 
            !county || t.counties?.includes(county)
          ),
          logistics_metrics: {
            total_capacity: transportersResult.data?.reduce((sum, t) => sum + (t.load_capacity || 0), 0),
            refrigerated_vehicles: transportersResult.data?.filter(t => t.has_refrigeration).length,
            coverage_counties: [...new Set(transportersResult.data?.flatMap(t => t.counties || []))]
          }
        }
        break

      case 'pricing':
        const priceAnalysis = marketPricesResult.data?.reduce((acc: any, price: any) => {
          if (!county || price.county === county) {
            if (!acc[price.commodity_name]) {
              acc[price.commodity_name] = {
                commodity: price.commodity_name,
                prices: [],
                average_price: 0,
                price_trend: 'stable'
              }
            }
            acc[price.commodity_name].prices.push({
              price: price.price,
              market: price.market_name,
              date: price.date_recorded
            })
          }
          return acc
        }, {})

        responseData = {
          price_analysis: Object.values(priceAnalysis || {}),
          market_volatility: 'low', // Would be calculated from actual data
          price_efficiency: 0.85
        }
        break

      case 'forecasts':
        responseData = {
          demand_forecasts: forecastsResult.data?.filter(f => 
            !county || f.county === county
          ),
          supply_projections: forecastsResult.data?.map(f => ({
            commodity: f.commodity_name,
            county: f.county,
            forecast_price: f.forecast_price,
            confidence: f.confidence_level,
            period: f.period
          }))
        }
        break

      default:
        responseData = {
          overview: {
            total_transporters: transportersResult.data?.length || 0,
            active_markets: [...new Set(marketPricesResult.data?.map(p => p.market_name))].length,
            commodities_tracked: [...new Set(marketPricesResult.data?.map(p => p.commodity_name))].length,
            counties_covered: [...new Set(marketPricesResult.data?.map(p => p.county))].length
          },
          recent_activity: {
            latest_prices: marketPricesResult.data?.slice(0, 10),
            new_forecasts: forecastsResult.data?.slice(0, 5)
          }
        }
    }

    const responseTime = Date.now() - startTime
    await logApiUsage(auth.user_id!, auth.api_key_id!, '/api/v1/supply-chain', req.method, 200, responseTime, req)

    return createApiResponse({
      data: responseData,
      meta: {
        analysis_type: analysisType,
        county_filter: county,
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
