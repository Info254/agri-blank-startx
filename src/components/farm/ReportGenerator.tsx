
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileDown, FileText, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ReportGenerator: React.FC = () => {
  const [reportType, setReportType] = useState('');
  const [period, setPeriod] = useState('');
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  const generateReport = async () => {
    if (!reportType || !period) {
      toast({
        title: "Missing Information",
        description: "Please select both report type and period",
        variant: "destructive"
      });
      return;
    }

    setGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      const reportData = {
        reportType,
        period,
        generatedAt: new Date().toISOString(),
        data: {
          totalRevenue: 8900,
          totalExpenses: 4720,
          netProfit: 4180,
          activeParcels: 3,
          totalArea: 26,
          averageYield: 2.3
        }
      };

      // Create CSV content
      const csvContent = `Report Type,${reportType}
Period,${period}
Generated At,${new Date().toLocaleString()}

Financial Summary
Total Revenue,KES ${reportData.data.totalRevenue.toLocaleString()}
Total Expenses,KES ${reportData.data.totalExpenses.toLocaleString()}
Net Profit,KES ${reportData.data.netProfit.toLocaleString()}

Farm Summary
Active Parcels,${reportData.data.activeParcels}
Total Area,${reportData.data.totalArea} acres
Average Yield,${reportData.data.averageYield} t/ha`;

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `farm-report-${reportType}-${period}-${new Date().getTime()}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      setGenerating(false);
      toast({
        title: "Report Generated",
        description: "Your farm report has been downloaded successfully"
      });
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Generate Reports
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Report Type</label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="financial">Financial Report</SelectItem>
                <SelectItem value="production">Production Report</SelectItem>
                <SelectItem value="inventory">Inventory Report</SelectItem>
                <SelectItem value="comprehensive">Comprehensive Report</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Period</label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current-month">Current Month</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={generateReport} 
            disabled={generating || !reportType || !period}
            className="flex-1"
          >
            {generating ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
            ) : (
              <FileDown className="h-4 w-4 mr-2" />
            )}
            {generating ? 'Generating...' : 'Generate Report'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportGenerator;
