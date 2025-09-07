// @ts-nocheck
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, Calendar, Thermometer, Syringe, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

type HealthRecord = {
  id: string;
  livestockId: string;
  livestockName: string;
  type: 'vaccination' | 'treatment' | 'checkup' | 'other';
  date: Date;
  description: string;
  vetName: string;
  notes: string;
  status: 'completed' | 'pending' | 'scheduled';
  nextCheckup?: Date;
  medications?: {
    name: string;
    dosage: string;
    duration: string;
  }[];
};

type Livestock = {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: number;
  gender: string;
};

export default function LivestockHealthRecords() {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<HealthRecord[]>([]);
  const [livestockList, setLivestockList] = useState<Livestock[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [livestockFilter, setLivestockFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch livestock and health records
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock data for demonstration
        const mockLivestock: Livestock[] = [
          { id: 'ls1', name: 'Betsy', type: 'Cow', breed: 'Friesian', age: 3, gender: 'Female' },
          { id: 'ls2', name: 'Daisy', type: 'Goat', breed: 'Galla', age: 2, gender: 'Female' },
          { id: 'ls3', name: 'Bruno', type: 'Bull', breed: 'Boran', age: 4, gender: 'Male' },
          { id: 'ls4', name: 'Molly', type: 'Sheep', breed: 'Dorper', age: 1, gender: 'Female' },
        ];

        const mockRecords: HealthRecord[] = [
          {
            id: 'hr1',
            livestockId: 'ls1',
            livestockName: 'Betsy',
            type: 'vaccination',
            date: new Date(2023, 5, 15),
            description: 'Annual vaccination - Lumpy Skin Disease',
            vetName: 'Dr. Wanjiku',
            notes: 'No adverse reactions observed',
            status: 'completed',
            nextCheckup: new Date(2024, 5, 15),
          },
          {
            id: 'hr2',
            livestockId: 'ls2',
            livestockName: 'Daisy',
            type: 'treatment',
            date: new Date(2023, 5, 20),
            description: 'Deworming treatment',
            vetName: 'Dr. Omondi',
            notes: 'Administered Albendazole 10%',
            status: 'completed',
            medications: [
              { name: 'Albendazole 10%', dosage: '5ml', duration: 'Single dose' },
            ],
          },
          {
            id: 'hr3',
            livestockId: 'ls3',
            livestockName: 'Bruno',
            type: 'checkup',
            date: new Date(2023, 6, 1),
            description: 'Routine health check',
            vetName: 'Dr. Wanjiku',
            notes: 'Good health condition',
            status: 'completed',
            nextCheckup: new Date(2023, 9, 1),
          },
          {
            id: 'hr4',
            livestockId: 'ls1',
            livestockName: 'Betsy',
            type: 'vaccination',
            date: new Date(2023, 6, 10),
            description: 'Foot and Mouth Disease vaccination',
            vetName: 'Dr. Omondi',
            notes: 'Scheduled for next dose in 6 months',
            status: 'completed',
            nextCheckup: new Date(2023, 12, 10),
          },
          {
            id: 'hr5',
            livestockId: 'ls4',
            livestockName: 'Molly',
            type: 'treatment',
            date: new Date(2023, 6, 15),
            description: 'Mastitis treatment',
            vetName: 'Dr. Wanjiku',
            notes: 'Prescribed antibiotics and anti-inflammatory',
            status: 'pending',
            medications: [
              { name: 'Penicillin', dosage: '3ml', duration: '5 days' },
              { name: 'Dexamethasone', dosage: '2ml', duration: '3 days' },
            ],
          },
          {
            id: 'hr6',
            livestockId: 'ls2',
            livestockName: 'Daisy',
            type: 'checkup',
            date: new Date(2023, 7, 1),
            description: 'Pregnancy check',
            vetName: 'Dr. Omondi',
            notes: 'Pregnancy confirmed - 2 months',
            status: 'scheduled',
            nextCheckup: new Date(2023, 9, 1),
          },
        ];

        setLivestockList(mockLivestock);
        setRecords(mockRecords);
        setFilteredRecords(mockRecords);
      } catch (error) {
        console.error('Error fetching health records:', error);
        toast({
          title: 'Error',
          description: 'Failed to load health records. Please try again.',
          variant: 'destructive',
        });
      }
    };

    fetchData();
  }, [toast]);

  // Apply filters
  useEffect(() => {
    let result = [...records];

    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (record) =>
          record.livestockName.toLowerCase().includes(term) ||
          record.description.toLowerCase().includes(term) ||
          record.vetName.toLowerCase().includes(term) ||
          record.notes.toLowerCase().includes(term)
      );
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      result = result.filter((record) => record.type === typeFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter((record) => record.status === statusFilter);
    }

    // Apply livestock filter
    if (livestockFilter !== 'all') {
      result = result.filter((record) => record.livestockId === livestockFilter);
    }

    // Apply tab filter
    if (activeTab === 'upcoming') {
      const today = new Date();
      result = result.filter(
        (record) => record.nextCheckup && new Date(record.nextCheckup) > today
      );
    } else if (activeTab === 'medication') {
      result = result.filter((record) => record.medications && record.medications.length > 0);
    }

    setFilteredRecords(result);
  }, [searchTerm, typeFilter, statusFilter, livestockFilter, activeTab, records]);

  const getStatusBadge = (status: string) => {
    const statusMap = {
      completed: { label: 'Completed', className: 'bg-green-100 text-green-800' },
      pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
      scheduled: { label: 'Scheduled', className: 'bg-blue-100 text-blue-800' },
    };

    const { label, className } = statusMap[status as keyof typeof statusMap] || { label: status, className: 'bg-gray-100 text-gray-800' };
    return <Badge className={`${className} text-xs`}>{label}</Badge>;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'vaccination':
        return <Syringe className="h-4 w-4 mr-1" />;
      case 'treatment':
        return <Activity className="h-4 w-4 mr-1" />;
      case 'checkup':
        return <Thermometer className="h-4 w-4 mr-1" />;
      default:
        return <AlertTriangle className="h-4 w-4 mr-1" />;
    }
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), 'MMM d, yyyy');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Livestock Health Records</h1>
          <p className="text-gray-600">Track and manage the health of your livestock</p>
        </div>
        <Button className="mt-4 md:mt-0" onClick={() => navigate('/livestock/health/add')}>
          <Plus className="mr-2 h-4 w-4" /> Add Health Record
        </Button>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full md:w-auto grid-cols-4">
          <TabsTrigger value="all">All Records</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="medication">Medication</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search records..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger>
            <Filter className="h-4 w-4 mr-2 text-gray-500" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="vaccination">Vaccination</SelectItem>
            <SelectItem value="treatment">Treatment</SelectItem>
            <SelectItem value="checkup">Checkup</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <Filter className="h-4 w-4 mr-2 text-gray-500" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={livestockFilter} onValueChange={setLivestockFilter}>
          <SelectTrigger>
            <Filter className="h-4 w-4 mr-2 text-gray-500" />
            <SelectValue placeholder="Filter by livestock" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Livestock</SelectItem>
            {livestockList.map((livestock) => (
              <SelectItem key={livestock.id} value={livestock.id}>
                {livestock.name} ({livestock.type})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredRecords.length === 0 ? (
        <Card className="text-center py-12">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <Search className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No records found</h3>
          <p className="mt-1 text-gray-500">
            {searchTerm || typeFilter !== 'all' || statusFilter !== 'all' || livestockFilter !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'No health records have been added yet.'}
          </p>
          <Button className="mt-4" onClick={() => {
            setSearchTerm('');
            setTypeFilter('all');
            setStatusFilter('all');
            setLivestockFilter('all');
          }}>
            Clear filters
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRecords.map((record) => (
            <Card key={record.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-4">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="rounded-full bg-blue-100 p-3">
                      {getTypeIcon(record.type)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-medium">
                          {record.livestockName} - {record.description}
                        </h3>
                        {getStatusBadge(record.status)}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        <span className="font-medium">Vet:</span> {record.vetName} • 
                        <span className="font-medium ml-1">Date:</span> {formatDate(record.date)}
                      </p>
                      {record.notes && (
                        <p className="text-sm text-gray-600 mt-2">{record.notes}</p>
                      )}
                      
                      {record.medications && record.medications.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Medications:</h4>
                          <ul className="space-y-1">
                            {record.medications.map((med, idx) => (
                              <li key={idx} className="text-sm text-gray-600">
                                • {med.name} - {med.dosage} for {med.duration}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 md:text-right">
                    {record.nextCheckup && (
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                        <Calendar className="h-4 w-4 mr-1" />
                        Next: {formatDate(record.nextCheckup)}
                      </div>
                    )}
                    <div className="mt-2 space-x-2">
                      <Button variant="outline" size="sm" onClick={() => navigate(`/livestock/health/${record.id}`)}>
                        View Details
                      </Button>
                      <Button size="sm" onClick={() => navigate(`/livestock/health/edit/${record.id}`)}>
                        Update
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-green-800">Vaccination Schedule</CardTitle>
            <CardDescription className="text-green-700">Upcoming vaccinations for your livestock</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium">Betsy - Lumpy Skin Disease</p>
                  <p className="text-sm text-green-700">Due: Jun 15, 2024</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium">Bruno - Foot and Mouth</p>
                  <p className="text-sm text-green-700">Due: Sep 1, 2023</p>
                </div>
              </li>
            </ul>
            <Button variant="outline" className="mt-4 w-full border-green-300 text-green-700 hover:bg-green-100">
              View All Vaccinations
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-blue-800">Treatment Plans</CardTitle>
            <CardDescription className="text-blue-700">Active treatments and medications</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Activity className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium">Molly - Mastitis</p>
                  <p className="text-sm text-blue-700">Antibiotics (3 days remaining)</p>
                </div>
              </li>
            </ul>
            <Button variant="outline" className="mt-4 w-full border-blue-300 text-blue-700 hover:bg-blue-100">
              View All Treatments
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-amber-800">Health Alerts</CardTitle>
            <CardDescription className="text-amber-700">Important health notices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-3 bg-white rounded-md border border-amber-200 mb-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium">Daisy - Deworming Due</p>
                  <p className="text-sm text-amber-700">Next deworming scheduled for Aug 15, 2023</p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-white rounded-md border border-amber-200">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium">Seasonal Alert</p>
                  <p className="text-sm text-amber-700">Increase in tick-borne diseases reported in your area</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
