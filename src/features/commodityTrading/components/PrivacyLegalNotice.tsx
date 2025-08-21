
import React from 'react';
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";
import { Info, AlertTriangle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface PrivacyLegalNoticeProps {
  variant?: 'default' | 'compact';
}

const PrivacyLegalNotice: React.FC<PrivacyLegalNoticeProps> = ({ variant = 'default' }) => {
  if (variant === 'compact') {
    return (
      <Alert className="mb-4 bg-blue-50">
        <Info className="h-4 w-4" />
        <AlertTitle>Data Privacy & Legal Notice</AlertTitle>
        <AlertDescription className="text-sm">
          We comply with the Data Protection Act (2019). Barter transactions are taxable under Kenyan law.
          <a href="#" className="text-primary underline ml-1">View full details</a>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="mb-6 rounded-lg border p-4 bg-muted/30">
      <h3 className="text-lg font-medium mb-3 flex items-center">
        <Info className="mr-2 h-5 w-5 text-blue-600" />
        Data Privacy & Legal Information
      </h3>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="privacy">
          <AccordionTrigger className="text-base font-medium">
            Data Privacy Protection (Data Protection Act, 2019)
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            <p className="mb-2">
              We comply with Kenya's Data Protection Act (2019) in the following ways:
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-2">
              <li>Your personal data is collected lawfully and only for legitimate purposes related to agricultural trade</li>
              <li>We only collect data that is necessary and relevant for barter exchange</li>
              <li>You have the right to access, correct, and request deletion of your personal information</li>
              <li>We implement appropriate security measures to protect your data</li>
              <li>We do not share your information with third parties without your consent</li>
            </ul>
            <p>
              To exercise your data protection rights, please contact our Data Protection Officer at
              <a href="mailto:dpo@kilimo.co.ke" className="text-primary underline ml-1">dpo@kilimo.co.ke</a>
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="taxes">
          <AccordionTrigger className="text-base font-medium">
            Tax Implications of Barter Transactions
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            <div className="flex items-start mb-2">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
              <p>
                According to the Kenya Income Tax Act, barter transactions are considered taxable income.
                The market value of goods received in a barter exchange may be subject to income tax.
              </p>
            </div>
            <p className="mb-2">
              While you are responsible for your own tax compliance, we recommend:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Keeping records of all barter transactions including goods exchanged and their market values</li>
              <li>Consulting with a tax professional regarding your specific tax obligations</li>
              <li>Reporting barter income on your annual tax returns as appropriate</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="consumer">
          <AccordionTrigger className="text-base font-medium">
            Consumer Protection & Dispute Resolution
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            <p className="mb-2">
              To protect users and prevent fraud in accordance with Kenya's Consumer Protection Act:
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-2">
              <li>All users must accurately represent their goods and commodities</li>
              <li>The platform provides a rating system to establish trust between trading partners</li>
              <li>Users should inspect goods before completing a transaction</li>
              <li>Our platform includes a dispute resolution process for addressing conflicts</li>
            </ul>
            <p>
              For dispute resolution assistance, contact our support team at 
              <a href="mailto:support@kilimo.co.ke" className="text-primary underline ml-1">support@kilimo.co.ke</a>
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default PrivacyLegalNotice;
