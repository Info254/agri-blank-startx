
import { MarketSentimentRecord } from "@/types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Analyzes market reports and comments for sentiment
 */
export const analyzeMarketSentiment = async (
  commodity: string,
  county: string,
  reports: string[]
): Promise<MarketSentimentRecord | null> => {
  try {
    if (!reports.length) {
      console.warn('No reports to analyze');
      return null;
    }
    
    // Combine reports into a single text
    const reportText = reports.join("\n\n");
    
    // Send to Supabase Edge Function for analysis
    const result = await sendToSupabaseForAnalysis(commodity, county, reportText);
    
    if (!result) {
      console.error('Failed to get sentiment analysis result');
      return null;
    }
    
    return result;
  } catch (error) {
    console.error('Error in sentiment analysis:', error);
    return null;
  }
};

/**
 * Send data to Supabase Edge Function for analysis
 */
async function sendToSupabaseForAnalysis(
  commodity: string, 
  county: string, 
  text: string
): Promise<MarketSentimentRecord | null> {
  try {
    // Call Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('analyze-sentiment', {
      body: {
        commodity,
        county,
        text
      }
    });

    if (error) {
      console.error('Error from sentiment analysis function:', error);
      return null;
    }

    if (!data) {
      console.error('No data returned from sentiment analysis');
      return null;
    }

    // Structure the response into our expected format
    return {
      id: crypto.randomUUID(),
      commodity_name: commodity,
      county: county,
      sentiment_score: data.sentimentScore || 0,
      report_count: 1,
      tags: data.tags || [],
      issues: data.issues || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Failed to call sentiment analysis function:', error);
    return null;
  }
}

/**
 * Fetch sentiment data from database
 */
export const fetchMarketSentiment = async (): Promise<MarketSentimentRecord[]> => {
  try {
    const { data, error } = await supabase
      .from('market_sentiment')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(50);
    
    if (error) {
      console.error('Error fetching market sentiment:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching market sentiment:', error);
    return [];
  }
};

/**
 * Submit new market report for sentiment analysis
 */
export const submitMarketReport = async (
  commodity: string,
  county: string,
  report: string
): Promise<boolean> => {
  try {
    const result = await analyzeMarketSentiment(commodity, county, [report]);
    return result !== null;
  } catch (error) {
    console.error('Error submitting market report:', error);
    return false;
  }
};
