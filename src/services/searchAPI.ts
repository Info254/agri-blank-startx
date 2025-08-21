
import { DataItem, SearchFilters } from '@/types';
import { SAMPLE_DATA } from './sampleData';
import { simulateDelay } from './apiUtils';
import { fetchAwardedTenders } from './awardedTendersAPI';

// Main search function that filters data based on provided filters
export const fetchData = async (filters?: SearchFilters): Promise<DataItem[]> => {
  // Simulate network delay
  await simulateDelay(800);
  
  // If the category is 'awarded-tender', fetch from Huggingface
  if (filters?.category === 'awarded-tender') {
    try {
      const tenders = await fetchAwardedTenders();
      let filteredTenders = tenders;
      
      // Apply query filter if it exists
      if (filters.query) {
        const query = filters.query.toLowerCase();
        filteredTenders = filteredTenders.filter(tender => 
          tender.tendersubject.toLowerCase().includes(query) || 
          tender.supplier.toLowerCase().includes(query) ||
          (tender.procuringentity && tender.procuringentity.toLowerCase().includes(query))
        );
      }
      
      // Apply location filter if it exists
      if (filters.location) {
        const location = filters.location.toLowerCase();
        filteredTenders = filteredTenders.filter(tender => 
          (tender.procuringentitycounty && tender.procuringentitycounty.toLowerCase().includes(location))
        );
      }
      
      // Map awarded tenders to DataItem format
      return filteredTenders.map(tender => ({
        id: tender.tenderno || Math.random().toString(36).substring(2, 9),
        title: tender.tendersubject,
        description: `Tender awarded to ${tender.supplier}`,
        category: 'awarded-tender',
        date: tender.awarddate || tender.finyrq || new Date().toISOString().split('T')[0],
        source: tender.procuringentity || 'Kenya Public Procurement',
        content: `
          Tender Number: ${tender.tenderno || 'N/A'}
          Subject: ${tender.tendersubject || 'N/A'}
          Supplier: ${tender.supplier || 'N/A'}
          Awarded Amount: ${tender.awardedamount || 'N/A'} ${tender.currency || 'KES'}
          Award Date: ${tender.awarddate || 'N/A'}
          Financial Year Quarter: ${tender.finyrq || 'N/A'}
          Procurement Method: ${tender.procurementmethod || 'N/A'}
          Procuring Entity: ${tender.procuringentity || 'N/A'}
          County: ${tender.procuringentitycounty || 'N/A'}
          Contact: ${tender.contactname || 'N/A'}
          Contact Email: ${tender.contactemail || 'N/A'}
          Contact Tel: ${tender.contacttel || 'N/A'}
          Contact Address: ${tender.contactaddress || 'N/A'}
        `,
        tags: [
          'awarded', 
          tender.procurementmethod || 'procurement', 
          tender.procuringentitycounty || 'kenya'
        ],
        location: tender.procuringentitycounty,
        contact: tender.contactemail || tender.contacttel
      }));
    } catch (error) {
      console.error("Error fetching awarded tenders:", error);
      return [];
    }
  }
  
  if (!filters) return SAMPLE_DATA;
  
  let filteredData = [...SAMPLE_DATA];
  
  // Apply category filter
  if (filters.category) {
    filteredData = filteredData.filter(item => item.category === filters.category);
  }
  
  // Apply query filter (search in title and description)
  if (filters.query) {
    const query = filters.query.toLowerCase();
    filteredData = filteredData.filter(item => 
      item.title.toLowerCase().includes(query) || 
      item.description.toLowerCase().includes(query) ||
      item.content.toLowerCase().includes(query)
    );
  }
  
  // Apply location filter
  if (filters.location) {
    const location = filters.location.toLowerCase();
    filteredData = filteredData.filter(item => 
      item.location?.toLowerCase().includes(location)
    );
  }
  
  // Apply date filters
  if (filters.dateFrom) {
    filteredData = filteredData.filter(item => 
      new Date(item.date) >= filters.dateFrom!
    );
  }
  
  if (filters.dateTo) {
    filteredData = filteredData.filter(item => 
      new Date(item.date) <= filters.dateTo!
    );
  }
  
  return filteredData;
};

export const fetchItemById = async (id: string): Promise<DataItem | undefined> => {
  // Simulate network delay
  await simulateDelay(500);
  
  return SAMPLE_DATA.find(item => item.id === id);
};
