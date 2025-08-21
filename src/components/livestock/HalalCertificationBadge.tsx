import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HalalCertificationBadgeProps {
  isHalal: boolean;
  certificateNumber?: string;
  certificationBody?: string;
  expiryDate?: string;
  className?: string;
}

export const HalalCertificationBadge: React.FC<HalalCertificationBadgeProps> = ({
  isHalal,
  certificateNumber,
  certificationBody,
  expiryDate,
  className = '',
}) => {
  if (!isHalal) {
    return null;
  }

  const isExpired = expiryDate ? new Date(expiryDate) < new Date() : false;
  const daysUntilExpiry = expiryDate 
    ? Math.ceil((new Date(expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const getStatusVariant = () => {
    if (isExpired) return 'destructive';
    if (daysUntilExpiry !== null && daysUntilExpiry <= 30) return 'warning';
    return 'default';
  };

  const getStatusIcon = () => {
    if (isExpired) return <AlertCircle className="h-3.5 w-3.5 mr-1" />;
    if (daysUntilExpiry !== null && daysUntilExpiry <= 30) return <Clock className="h-3.5 w-3.5 mr-1" />;
    return <CheckCircle className="h-3.5 w-3.5 mr-1" />;
  };

  const getTooltipContent = () => {
    if (!isHalal) return 'Not Halal Certified';
    
    let content = [
      <div key="header" className="font-semibold mb-1">Halal Certified</div>,
    ];

    if (certificationBody) {
      content.push(<div key="body">Certified by: {certificationBody}</div>);
    }
    
    if (certificateNumber) {
      content.push(<div key="number">Certificate: {certificateNumber}</div>);
    }
    
    if (expiryDate) {
      const expiryText = isExpired 
        ? `Expired on ${new Date(expiryDate).toLocaleDateString()}`
        : `Expires in ${daysUntilExpiry} days (${new Date(expiryDate).toLocaleDateString()})`;
      
      content.push(
        <div key="expiry" className={isExpired ? 'text-destructive font-medium' : ''}>
          {expiryText}
        </div>
      );
    }

    return content;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant={getStatusVariant()}
            className={`inline-flex items-center ${className}`}
          >
            {getStatusIcon()}
            Halal Certified
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          {getTooltipContent()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default HalalCertificationBadge;
