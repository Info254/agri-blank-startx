
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { commodity, county, text } = await req.json()

    if (!commodity || !county || !text) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: commodity, county, text' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Simple sentiment analysis based on keyword matching
    const positiveKeywords = [
      'good', 'excellent', 'high quality', 'satisfied', 'profitable', 'successful',
      'growing well', 'healthy', 'abundant', 'fair prices', 'good harvest',
      'reliable', 'trustworthy', 'recommend', 'effective', 'efficient'
    ]

    const negativeKeywords = [
      'poor', 'bad', 'low quality', 'disappointed', 'losses', 'failed',
      'diseased', 'pest', 'drought', 'expensive', 'cheated', 'fake',
      'counterfeit', 'unreliable', 'delay', 'problem', 'issue', 'concern'
    ]

    const neutralKeywords = [
      'average', 'normal', 'standard', 'typical', 'usual', 'moderate'
    ]

    // Convert text to lowercase for analysis
    const lowerText = text.toLowerCase()

    // Count keyword matches
    let positiveScore = 0
    let negativeScore = 0
    let neutralScore = 0

    positiveKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) positiveScore++
    })

    negativeKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) negativeScore++
    })

    neutralKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) neutralScore++
    })

    // Calculate sentiment score (-1 to 1)
    const totalScore = positiveScore + negativeScore + neutralScore
    let sentimentScore = 0

    if (totalScore > 0) {
      sentimentScore = (positiveScore - negativeScore) / totalScore
    }

    // Extract tags and issues
    const tags = []
    const issues = []

    // Tag extraction based on content
    if (lowerText.includes('price')) tags.push('pricing')
    if (lowerText.includes('quality')) tags.push('quality')
    if (lowerText.includes('market')) tags.push('market')
    if (lowerText.includes('transport')) tags.push('logistics')
    if (lowerText.includes('storage')) tags.push('storage')
    if (lowerText.includes('disease') || lowerText.includes('pest')) {
      tags.push('crop_health')
      issues.push('pest_disease')
    }
    if (lowerText.includes('fake') || lowerText.includes('counterfeit')) {
      issues.push('counterfeit_products')
    }
    if (lowerText.includes('delay') || lowerText.includes('late')) {
      issues.push('delivery_delays')
    }

    // Store sentiment data in database
    const { data: sentimentData, error: insertError } = await supabase
      .from('market_sentiment')
      .insert({
        commodity_name: commodity,
        county: county,
        sentiment_score: sentimentScore,
        report_count: 1,
        tags: tags,
        issues: issues
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting sentiment data:', insertError)
    }

    return new Response(
      JSON.stringify({
        sentimentScore,
        sentiment: sentimentScore > 0.1 ? 'positive' : sentimentScore < -0.1 ? 'negative' : 'neutral',
        tags,
        issues,
        confidence: Math.min(totalScore / 10, 1), // Confidence based on keyword matches
        analysis: {
          positiveScore,
          negativeScore,
          neutralScore,
          totalKeywords: totalScore
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in sentiment analysis:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error during sentiment analysis' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
