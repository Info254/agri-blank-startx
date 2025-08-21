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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { action, ...params } = await req.json()

    let result;

    switch (action) {
      case 'search_regulatory_alerts_advanced':
        result = await searchRegulatoryAlertsAdvanced(supabaseClient, params)
        break
      case 'analyze_churn_risk':
        result = await analyzeChurnRisk(supabaseClient, params)
        break
      case 'calculate_relationship_health':
        result = await calculateRelationshipHealth(supabaseClient, params)
        break
      case 'generate_supply_chain_optimizations':
        result = await generateSupplyChainOptimizations(supabaseClient, params)
        break
      case 'update_behavioral_metrics':
        result = await updateBehavioralMetrics(supabaseClient, params)
        break
      case 'get_alert_engagement_stats':
        result = await getAlertEngagementStats(supabaseClient, params)
        break
      default:
        throw new Error(`Unknown action: ${action}`)
    }

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

async function searchRegulatoryAlertsAdvanced(supabase: any, params: any) {
  const {
    query,
    category,
    severity,
    region,
    status,
    dateFrom,
    dateTo,
    limit = 50,
    offset = 0
  } = params

  let queryBuilder = supabase
    .from('regulatory_alerts')
    .select(`
      *,
      alert_engagements(count),
      alert_author:author_id(name, organization, verified)
    `)

  if (query) {
    queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
  }

  if (category) {
    queryBuilder = queryBuilder.eq('category', category)
  }

  if (severity) {
    queryBuilder = queryBuilder.eq('severity', severity)
  }

  if (region) {
    queryBuilder = queryBuilder.contains('affected_regions', [region])
  }

  if (status) {
    queryBuilder = queryBuilder.eq('status', status)
  }

  if (dateFrom) {
    queryBuilder = queryBuilder.gte('date_posted', dateFrom)
  }

  if (dateTo) {
    queryBuilder = queryBuilder.lte('date_posted', dateTo)
  }

  queryBuilder = queryBuilder
    .range(offset, offset + limit - 1)
    .order('date_posted', { ascending: false })

  const { data, error } = await queryBuilder

  if (error) throw error
  return { data }
}

async function analyzeChurnRisk(supabase: any, params: any) {
  const { playerType, timeframe = 90 } = params

  // Get behavioral metrics for analysis
  let queryBuilder = supabase
    .from('behavioral_metrics')
    .select('*')

  if (playerType) {
    queryBuilder = queryBuilder.eq('player_type', playerType)
  }

  const { data: metrics, error } = await queryBuilder

  if (error) throw error

  // Analyze churn risk based on behavioral patterns
  const churnPredictions = metrics.map((metric: any) => {
    const riskScore = calculateChurnRiskScore(metric)
    const riskLevel = getRiskLevel(riskScore)
    
    return {
      id: `churn_${metric.id}`,
      player_id: metric.player_id,
      player_type: metric.player_type,
      risk_score: riskScore,
      risk_level: riskLevel,
      key_indicators: {
        engagement_trend: metric.metrics?.engagement_level < 5 ? 'DECLINING' : 'STABLE',
        compliance_rate: metric.metrics?.compliance_rate || 0,
        responsiveness: metric.metrics?.responsiveness || 0
      },
      predicted_churn_date: riskScore > 70 ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null,
      recommended_actions: getRecommendedActions(riskScore, metric.player_type),
      last_updated: new Date().toISOString()
    }
  })

  // Store predictions in database
  const { error: insertError } = await supabase
    .from('churn_predictions')
    .upsert(churnPredictions)

  if (insertError) throw insertError

  return { data: churnPredictions }
}

async function calculateRelationshipHealth(supabase: any, params: any) {
  const { partnerId1, partnerId2 } = params

  // Get transaction and interaction data between partners
  const { data: transactions, error: txError } = await supabase
    .from('cooperative_transactions')
    .select('*')
    .or(`from_partner.eq.${partnerId1},to_partner.eq.${partnerId1}`)
    .or(`from_partner.eq.${partnerId2},to_partner.eq.${partnerId2}`)

  if (txError) throw txError

  const { data: interactions, error: intError } = await supabase
    .from('partner_interactions')
    .select('*')
    .or(`partner_1.eq.${partnerId1},partner_1.eq.${partnerId2}`)
    .or(`partner_2.eq.${partnerId1},partner_2.eq.${partnerId2}`)

  if (intError) throw intError

  // Calculate health metrics
  const healthScore = calculateHealthScore(transactions, interactions)
  const healthTrend = calculateHealthTrend(transactions, interactions)
  
  const relationshipHealth = {
    id: `rel_${partnerId1}_${partnerId2}`,
    partner_id_1: partnerId1,
    partner_id_2: partnerId2,
    health_score: healthScore,
    health_trend: healthTrend,
    key_metrics: {
      transaction_volume: transactions.reduce((sum: number, t: any) => sum + (t.amount || 0), 0),
      payment_timeliness: calculatePaymentTimeliness(transactions),
      communication_frequency: interactions.length,
      quality_compliance: calculateQualityCompliance(transactions)
    },
    risk_factors: identifyRiskFactors(transactions, interactions),
    strength_factors: identifyStrengthFactors(transactions, interactions),
    recommendations: generateHealthRecommendations(healthScore, transactions, interactions),
    last_assessed: new Date().toISOString()
  }

  // Store in database
  const { error: insertError } = await supabase
    .from('relationship_health')
    .upsert(relationshipHealth)

  if (insertError) throw insertError

  return { data: relationshipHealth }
}

async function generateSupplyChainOptimizations(supabase: any, params: any) {
  const { type, region, minRoi = 15 } = params

  // Analyze current supply chain data
  const { data: cooperatives, error: coopError } = await supabase
    .from('cooperatives')
    .select(`
      *,
      cooperative_transactions(*),
      cooperative_memberships(*)
    `)

  if (coopError) throw coopError

  const { data: transactions, error: txError } = await supabase
    .from('cooperative_transactions')
    .select('*')
    .gte('transaction_date', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString())

  if (txError) throw txError

  // Generate optimization opportunities
  const optimizations = []

  // Bulk purchasing optimization
  const bulkOpportunities = identifyBulkPurchasingOpportunities(cooperatives, transactions)
  optimizations.push(...bulkOpportunities)

  // Route optimization
  const routeOptimizations = identifyRouteOptimizations(cooperatives, transactions)
  optimizations.push(...routeOptimizations)

  // Quality improvement opportunities
  const qualityOptimizations = identifyQualityImprovements(cooperatives, transactions)
  optimizations.push(...qualityOptimizations)

  // Filter by minimum ROI
  const filteredOptimizations = optimizations.filter(opt => opt.roi >= minRoi)

  // Store optimizations
  const { error: insertError } = await supabase
    .from('supply_chain_optimizations')
    .upsert(filteredOptimizations)

  if (insertError) throw insertError

  return { data: filteredOptimizations }
}

async function updateBehavioralMetrics(supabase: any, params: any) {
  const { playerId, playerType, metrics, observations, concerns, recommendations } = params

  const behavioralMetric = {
    player_id: playerId,
    player_type: playerType,
    metrics: metrics,
    observations: observations,
    concerns: concerns,
    recommendations: recommendations,
    report_date: new Date().toISOString(),
    next_follow_up: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  }

  const { data, error } = await supabase
    .from('behavioral_metrics')
    .upsert(behavioralMetric)
    .select()

  if (error) throw error
  return { data: data[0] }
}

async function getAlertEngagementStats(supabase: any, params: any) {
  const { alertId } = params

  const { data, error } = await supabase
    .from('alert_engagements')
    .select('engagement_type, COUNT(*)')
    .eq('alert_id', alertId)
    .group('engagement_type')

  if (error) throw error

  const stats = data.reduce((acc: any, row: any) => {
    acc[row.engagement_type] = row.count
    return acc
  }, {})

  return { data: stats }
}

// Helper functions
function calculateChurnRiskScore(metric: any): number {
  const weights = {
    engagement: 0.3,
    compliance: 0.25,
    responsiveness: 0.2,
    collaboration: 0.15,
    innovation: 0.1
  }

  const scores = metric.metrics || {}
  
  const riskScore = 100 - (
    (scores.engagement_level || 5) * weights.engagement * 10 +
    (scores.compliance_rate || 80) * weights.compliance / 100 * 100 +
    (scores.responsiveness || 5) * weights.responsiveness * 10 +
    (scores.collaboration_score || 5) * weights.collaboration * 10 +
    (scores.innovation_adoption || 5) * weights.innovation * 10
  )

  return Math.max(0, Math.min(100, riskScore))
}

function getRiskLevel(score: number): string {
  if (score >= 80) return 'CRITICAL'
  if (score >= 60) return 'HIGH'
  if (score >= 40) return 'MEDIUM'
  return 'LOW'
}

function getRecommendedActions(riskScore: number, playerType: string): string[] {
  const actions = []
  
  if (riskScore > 70) {
    actions.push('Schedule urgent intervention meeting')
    actions.push('Assign dedicated relationship manager')
  }
  
  if (riskScore > 50) {
    actions.push('Increase communication frequency')
    actions.push('Provide additional training and support')
  }
  
  if (playerType === 'FARMER') {
    actions.push('Connect with successful peer farmers')
    actions.push('Offer technical assistance')
  } else if (playerType === 'AGRO_DEALER') {
    actions.push('Review inventory management')
    actions.push('Improve customer service training')
  }
  
  return actions
}

function calculateHealthScore(transactions: any[], interactions: any[]): number {
  if (!transactions.length && !interactions.length) return 0
  
  const transactionScore = transactions.length > 0 ? 
    Math.min(transactions.length * 10, 100) : 0
  const interactionScore = interactions.length > 0 ? 
    Math.min(interactions.length * 5, 100) : 0
  
  return (transactionScore + interactionScore) / 2
}

function calculateHealthTrend(transactions: any[], interactions: any[]): string {
  const now = new Date()
  const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
  
  const recentTransactions = transactions.filter(t => 
    new Date(t.transaction_date) > threeMonthsAgo
  ).length
  
  const olderTransactions = transactions.filter(t => 
    new Date(t.transaction_date) <= threeMonthsAgo
  ).length
  
  if (recentTransactions > olderTransactions * 1.2) return 'IMPROVING'
  if (recentTransactions < olderTransactions * 0.8) return 'DECLINING'
  return 'STABLE'
}

function calculatePaymentTimeliness(transactions: any[]): number {
  const paidOnTime = transactions.filter(t => 
    t.status === 'COMPLETED' && t.payment_delay_days <= 7
  ).length
  
  return transactions.length > 0 ? (paidOnTime / transactions.length) * 100 : 0
}

function calculateQualityCompliance(transactions: any[]): number {
  const qualityIssues = transactions.filter(t => 
    t.quality_issues && t.quality_issues.length > 0
  ).length
  
  return transactions.length > 0 ? 
    ((transactions.length - qualityIssues) / transactions.length) * 100 : 100
}

function identifyRiskFactors(transactions: any[], interactions: any[]): string[] {
  const risks = []
  
  if (transactions.some(t => t.payment_delay_days > 14)) {
    risks.push('Frequent payment delays')
  }
  
  if (interactions.filter(i => i.type === 'COMPLAINT').length > 2) {
    risks.push('Multiple complaints')
  }
  
  return risks
}

function identifyStrengthFactors(transactions: any[], interactions: any[]): string[] {
  const strengths = []
  
  if (transactions.every(t => t.payment_delay_days <= 7)) {
    strengths.push('Excellent payment timeliness')
  }
  
  if (transactions.length > 10) {
    strengths.push('High transaction volume')
  }
  
  return strengths
}

function generateHealthRecommendations(healthScore: number, transactions: any[], interactions: any[]): string[] {
  const recommendations = []
  
  if (healthScore < 50) {
    recommendations.push('Urgent relationship intervention needed')
    recommendations.push('Schedule face-to-face meeting')
  } else if (healthScore < 70) {
    recommendations.push('Increase communication frequency')
    recommendations.push('Address payment timing issues')
  } else {
    recommendations.push('Maintain current relationship practices')
    recommendations.push('Explore expansion opportunities')
  }
  
  return recommendations
}

function identifyBulkPurchasingOpportunities(cooperatives: any[], transactions: any[]): any[] {
  // Implementation for bulk purchasing analysis
  return []
}

function identifyRouteOptimizations(cooperatives: any[], transactions: any[]): any[] {
  // Implementation for route optimization analysis
  return []
}

function identifyQualityImprovements(cooperatives: any[], transactions: any[]): any[] {
  // Implementation for quality improvement analysis
  return []
}
