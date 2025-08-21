// print-city-markets.ts
import { supabase } from './src/integrations/supabase/client';

async function main() {
  const { data, error } = await supabase
    .from('city_markets')
    .select('market_name, city, county')
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching city markets:', error);
    process.exit(1);
  }

  if (!data || data.length === 0) {
    console.log('No city markets found.');
    return;
  }

  console.log('City Markets:');
  data.forEach((market: any, idx: number) => {
    console.log(`${idx + 1}. ${market.market_name} (${market.city}, ${market.county})`);
  });
}

main(); 