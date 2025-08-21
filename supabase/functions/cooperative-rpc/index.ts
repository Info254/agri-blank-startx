import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

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
      case 'search_cooperatives_advanced':
        result = await searchCooperativesAdvanced(supabaseClient, params)
        break
      case 'search_cooperatives_by_location':
        result = await searchCooperativesByLocation(supabaseClient, params)
        break
      case 'get_cooperative_analytics':
        result = await getCooperativeAnalytics(supabaseClient, params)
        break
      case 'get_nearby_cooperatives':
        result = await getNearbyCooperatives(supabaseClient, params)
        break
      case 'calculate_cooperative_performance':
        result = await calculateCooperativePerformance(supabaseClient, params)
        break
      case 'predict_churn_risk':
        result = await predictChurnRisk(supabaseClient, params)
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
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

interface SearchParams {
  query?: string;
  type?: string;
  county?: string;
  subcounty?: string;
  minMembers?: number;
  maxMembers?: number;
  minRating?: number;
  isRecruiting?: boolean;
  organicCertified?: boolean;
  limit?: number;
  offset?: number;
}

async function searchCooperativesAdvanced(supabase: SupabaseClient, params: SearchParams) {
  const {
    query,
    type,
    county,
    subcounty,
    minMembers,
    maxMembers,
    minRating,
    isRecruiting,
    organicCertified,
    limit = 50,
    offset = 0
  } = params

  let queryBuilder = supabase
    .from('cooperatives')
    .select(`
      *,
      cooperative_memberships(count),
      cooperative_performance(*)
    `)

  if (query) {
    queryBuilder = queryBuilder.or(`name.ilike.%${query}%,description.ilike.%${query}%`)
  }

  if (type) {
    queryBuilder = queryBuilder.eq('type', type)
  }

  if (county) {
    queryBuilder = queryBuilder.eq('location->>county', county)
  }

  if (subcounty) {
    queryBuilder = queryBuilder.eq('location->>subcounty', subcounty)
  }

  if (minMembers) {
    queryBuilder = queryBuilder.gte('member_count', minMembers)
  }

  if (maxMembers) {
    queryBuilder = queryBuilder.lte('member_count', maxMembers)
  }

  if (minRating) {
    queryBuilder = queryBuilder.gte('performance->>rating', minRating)
  }

  if (isRecruiting !== undefined) {
    queryBuilder = queryBuilder.eq('is_recruiting', isRecruiting)
  }

  if (organicCertified !== undefined) {
    queryBuilder = queryBuilder.eq('organic_certified', organicCertified)
  }

  queryBuilder = queryBuilder
    .range(offset, offset + limit - 1)
    .order('created_at', { ascending: false })

  const { data, error } = await queryBuilder

  if (error) throw error
  return { data }
}

interface LocationSearchParams {
  latitude: number;
  longitude: number;
  radius?: number;
  limit?: number;
  offset?: number;
}

async function searchCooperativesByLocation(supabase: SupabaseClient, params: LocationSearchParams) {
  const { latitude, longitude, radius = 50, limit = 20 } = params

  const { data, error } = await supabase.rpc('cooperatives_within_radius', {
    lat: latitude,
    lng: longitude,
    radius_km: radius,
    result_limit: limit
  })

  if (error) throw error
  return { data }
}

interface AnalyticsParams {
  cooperativeId: string;
  startDate?: string;
  endDate?: string;
}

async function getCooperativeAnalytics(supabase: SupabaseClient, params: AnalyticsParams) {
  const { cooperativeId } = params

  const { data: cooperative, error: coopError } = await supabase
    .from('cooperatives')
    .select(`
      *,
      cooperative_memberships(*),
      cooperative_transactions(*),
      cooperative_meetings(*),
      cooperative_performance(*)
    `)
    .eq('id', cooperativeId)
    .single()

  if (coopError) throw coopError

  // Calculate analytics
  const analytics = {
    memberGrowthRate: calculateMemberGrowthRate(cooperative.cooperative_memberships),
    transactionVolume: calculateTransactionVolume(cooperative.cooperative_transactions),
    meetingAttendance: calculateMeetingAttendance(cooperative.cooperative_meetings),
    performanceScore: cooperative.cooperative_performance?.overall_score || 0
  }

  return { data: { cooperative, analytics } }
}

interface NearbyParams {
  latitude: number;
  longitude: number;
  maxDistance?: number;
  limit?: number;
}

async function getNearbyCooperatives(supabase: SupabaseClient, params: NearbyParams) {
  const { latitude, longitude, maxDistance = 25, limit = 10 } = params

  const { data, error } = await supabase.rpc('find_nearby_cooperatives', {
    user_lat: latitude,
    user_lng: longitude,
    max_distance_km: maxDistance,
    result_limit: limit
  })

  if (error) throw error
  return { data }
}

interface PerformanceParams {
  cooperativeId: string;
  period?: string;
}

async function calculateCooperativePerformance(supabase: SupabaseClient, params: PerformanceParams) {
  const { cooperativeId } = params

  // Get cooperative data for performance calculation
  const { data: cooperative, error } = await supabase
    .from('cooperatives')
    .select(`
      *,
      cooperative_memberships(*),
      cooperative_transactions(*),
      cooperative_meetings(*)
    `)
    .eq('id', cooperativeId)
    .single()

  if (error) throw error

  // Calculate performance metrics
  const performance = {
    memberSatisfaction: calculateMemberSatisfaction(cooperative.cooperative_memberships),
    financialHealth: calculateFinancialHealth(cooperative.cooperative_transactions),
    governanceScore: calculateGovernanceScore(cooperative.cooperative_meetings),
    overallScore: 0
  }

  performance.overallScore = (
    performance.memberSatisfaction * 0.4 +
    performance.financialHealth * 0.4 +
    performance.governanceScore * 0.2
  )

  // Update performance in database
  const { error: updateError } = await supabase
    .from('cooperative_performance')
    .upsert({
      cooperative_id: cooperativeId,
      member_satisfaction: performance.memberSatisfaction,
      financial_health: performance.financialHealth,
      governance_score: performance.governanceScore,
      overall_score: performance.overallScore,
      last_calculated: new Date().toISOString()
    })

  if (updateError) throw updateError

  return { data: performance }
}

interface ChurnParams {
  cooperativeId: string;
}

async function predictChurnRisk(supabase: SupabaseClient, params: ChurnParams) {
  const { cooperativeId } = params

  // Get cooperative data for churn prediction
  const { data: cooperative, error } = await supabase
    .from('cooperatives')
    .select(`
      *,
      cooperative_memberships(*),
      cooperative_transactions(*),
      cooperative_meetings(*)
    `)
    .eq('id', cooperativeId)
    .single()

  if (error) throw error

  // Calculate churn risk factors
  const riskFactors = {
    memberTurnover: calculateMemberTurnover(cooperative.cooperative_memberships),
    financialStress: calculateFinancialStress(cooperative.cooperative_transactions),
    engagementLevel: calculateEngagementLevel(cooperative.cooperative_meetings),
    marketConditions: await getMarketConditions(supabase, cooperative.location)
  }

  return { data: { cooperative, riskFactors, churnRisk: calculateChurnRisk(riskFactors) } }
}

interface RelationshipParams {
  cooperativeId: string;
}

async function _calculateRelationshipHealth(supabase: SupabaseClient, params: RelationshipParams) {
  const { cooperativeId } = params

  // Get relationship data
  const { data: relationships, error } = await supabase
    .from('cooperative_relationships')
    .select('*')
    .or(`cooperative_id.eq.${cooperativeId},partner_id.eq.${cooperativeId}`)

  if (error) throw error

  // Calculate relationship health metrics
  const healthMetrics = {
    trustScore: calculateTrustScore(relationships),
    communicationFrequency: calculateCommunicationFrequency(relationships),
    mutualBenefits: calculateMutualBenefits(relationships),
    conflictResolution: calculateConflictResolution(relationships)
  }

  return { data: { relationships, healthMetrics } }
}

interface OptimizationParams {
  cooperativeId: string;
  targetMetric?: string;
}

async function _generateSupplyChainOptimizations(supabase: SupabaseClient, params: OptimizationParams) {
  const { cooperativeId } = params

  // Get supply chain data
  const { data: supplyChainData, error } = await supabase
    .from('supply_chain_data')
    .select('*')
    .eq('cooperative_id', cooperativeId)

  if (error) throw error

  // Generate optimization recommendations
  const optimizations = {
    costReduction: generateCostOptimizations(supplyChainData),
    timeEfficiency: generateTimeOptimizations(supplyChainData),
    qualityImprovement: generateQualityOptimizations(supplyChainData),
    sustainabilityEnhancement: generateSustainabilityOptimizations(supplyChainData)
  }

  return { data: { supplyChainData, optimizations } }
}

// Helper functions with proper types
interface Membership {
  join_date: string;
  satisfaction_score?: number;
}

interface Transaction {
  amount: number;
  type: string;
}

interface Meeting {
  date: string;
  attendees_count?: number;
}

function calculateMemberGrowthRate(memberships: Membership[]): number {
  if (!memberships || memberships.length === 0) return 0
  
  const now = new Date()
  const sixMonthsAgo = new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000)
  
  const recentMembers = memberships.filter(m => new Date(m.join_date) > sixMonthsAgo)
  return (recentMembers.length / memberships.length) * 100
}

function calculateTransactionVolume(transactions: Transaction[]): number {
  if (!transactions || transactions.length === 0) return 0
  return transactions.reduce((sum, t) => sum + (t.amount || 0), 0)
}

function calculateMeetingAttendance(meetings: Meeting[]): number {
  if (!meetings || meetings.length === 0) return 0
  const totalAttendees = meetings.reduce((sum, m) => sum + (m.attendees_count || 0), 0)
  return meetings.length > 0 ? totalAttendees / meetings.length : 0
}

function calculateMemberSatisfaction(memberships: Membership[]): number {
  if (!memberships || memberships.length === 0) return 0
  const satisfactionScores = memberships.filter(m => m.satisfaction_score)
  return satisfactionScores.length > 0 ? 
    satisfactionScores.reduce((sum, m) => sum + (m.satisfaction_score || 0), 0) / satisfactionScores.length : 0
}

function calculateFinancialHealth(transactions: Transaction[]): number {
  if (!transactions || transactions.length === 0) return 0
  const income = transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0)
  const expenses = transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0)
  return income > 0 ? (income - expenses) / income : 0
}

function calculateGovernanceScore(meetings: Meeting[]): number {
  if (!meetings || meetings.length === 0) return 0
  const recentMeetings = meetings.filter(m => {
    const meetingDate = new Date(m.date)
    const threeMonthsAgo = new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000)
    return meetingDate > threeMonthsAgo
  })
  return Math.min(recentMeetings.length * 25, 100) // Max 4 meetings for 100% score
}

// Simplified stub implementations for missing functions
function calculateMemberTurnover(_memberships: Membership[]): number { return 0.1 }
function calculateFinancialStress(_transactions: Transaction[]): number { return 0.2 }
function calculateEngagementLevel(_meetings: Meeting[]): number { return 0.8 }
function getMarketConditions(_supabase: SupabaseClient, _location: unknown): Promise<number> { return Promise.resolve(0.5) }
function calculateChurnRisk(_factors: unknown): number { return 0.3 }
function calculateTrustScore(_relationships: unknown[]): number { return 0.8 }
function calculateCommunicationFrequency(_relationships: unknown[]): number { return 0.7 }
function calculateMutualBenefits(_relationships: unknown[]): number { return 0.6 }
function calculateConflictResolution(_relationships: unknown[]): number { return 0.9 }
function generateCostOptimizations(_data: unknown[]): unknown { return {} }
function generateTimeOptimizations(_data: unknown[]): unknown { return {} }
function generateQualityOptimizations(_data: unknown[]): unknown { return {} }
function generateSustainabilityOptimizations(_data: unknown[]): unknown { return {} }
