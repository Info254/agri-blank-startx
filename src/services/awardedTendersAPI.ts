
import { AwardedTender } from '@/types';

// Function to fetch awarded tenders from Huggingface
export const fetchAwardedTenders = async (): Promise<AwardedTender[]> => {
  try {
    const response = await fetch(
      "https://datasets-server.huggingface.co/first-rows?dataset=Olive254%2FAwardedPublicProcurementTendersKenya&config=default&split=train"
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Extract rows from the response
    const rows = data.rows || [];
    
    // Map the rows to our AwardedTender interface
    return rows.map((row: any) => {
      const tender: AwardedTender = {
        tenderno: row.row.tenderno || '',
        tendersubject: row.row.tendersubject || '',
        finyrq: row.row.finyrq || '',
        supplier: row.row.supplier || '',
        supplierscore: row.row.supplierscore,
        supplierbid: row.row.supplierbid,
        contactaddress: row.row.contactaddress,
        contactname: row.row.contactname,
        contacttel: row.row.contacttel,
        contactemail: row.row.contactemail,
        awarddate: row.row.awarddate,
        awardedamount: row.row.awardedamount,
        currency: row.row.currency,
        procuringentity: row.row.procuringentity,
        procuringentitycounty: row.row.procuringentitycounty,
        procurementmethod: row.row.procurementmethod
      };
      return tender;
    });
  } catch (error) {
    console.error("Error fetching awarded tenders:", error);
    return [];
  }
};
