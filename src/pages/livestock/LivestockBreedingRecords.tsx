import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, Calendar, Heart, Baby, Droplets, CalendarDays, CalendarCheck, CalendarX } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, addDays, isAfter, isBefore, differenceInDays } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

type BreedingRecord = {
  id: string;
  femaleId: string;
  femaleName: string;
  femaleBreed: string;
  maleId: string;
  maleName: string;
  maleBreed: string;
  breedingDate: Date;
  expectedBirthDate: Date;
  actualBirthDate?: Date;
  status: 'pregnant' | 'open' | 'calved' | 'failed';
  pregnancyCheckDate?: Date;
  pregnancyCheckResult?: 'positive' | 'negative';
  notes?: string;
  offspring?: {
    id: string;
    name: string;
    gender: 'male' | 'female';
    birthWeight: number;
    status: 'alive' | 'dead' | 'sold';
  }[];
};

type Livestock = {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: number;
  gender: 'male' | 'female';
  lastBreedingDate?: Date;
  status: 'available' | 'pregnant' | 'with_calf' | 'sick';
};

export default function LivestockBreedingRecords() {
  const [records, setRecords] = useState<BreedingRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<BreedingRecord[]>([]);
  const [livestockList, setLivestockList] = useState<Livestock[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [livestockFilter, setLivestockFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch livestock and breeding records
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock data for demonstration
        const mockLivestock: Livestock[] = [
          { id: 'ls1', name: 'Betsy', type: 'Cow', breed: 'Friesian', age: 3, gender: 'female', status: 'pregnant' },
          { id: 'ls2', name: 'Daisy', type: 'Cow', breed: 'Ayrshire', age: 4, gender: 'female', status: 'with_calf' },
          { id: 'ls3', name: 'Bruno', type: 'Bull', breed: 'Boran', age: 4, gender: 'male', status: 'available' },
          { id: 'ls4', name: 'Molly', type: 'Cow', breed: 'Sahiwal', age: 5, gender: 'female', status: 'available' },
          { id: 'ls5', name: 'Max', type: 'Bull', breed: 'Sahiwal', age: 5, gender: 'male', status: 'available' },
          { id: 'ls6', name: 'Bella', type: 'Cow', breed: 'Jersey', age: 2, gender: 'female', status: 'pregnant' },
        ];

        const mockRecords: BreedingRecord[] = [
          {
            id: 'br1',
            femaleId: 'ls1',
            femaleName: 'Betsy',
            femaleBreed: 'Friesian',
            maleId: 'ls3',
            maleName: 'Bruno',
            maleBreed: 'Boran',
            breedingDate: new Date(2023, 3, 15),
            expectedBirthDate: new Date(2023, 12, 25),
            status: 'pregnant',
            pregnancyCheckDate: new Date(2023, 5, 1),
            pregnancyCheckResult: 'positive',
            notes: 'AI used - Semen from premium Boran bull',
          },
          {
            id: 'br2',
            femaleId: 'ls2',
            femaleName: 'Daisy',
            femaleBreed: 'Ayrshire',
            maleId: 'ls3',
            maleName: 'Bruno',
            maleBreed: 'Boran',
            breedingDate: new Date(2022, 11, 10),
            expectedBirthDate: new Date(2023, 8, 20),
            actualBirthDate: new Date(2023, 8, 18),
            status: 'calved',
            pregnancyCheckDate: new Date(2023, 1, 15),
            pregnancyCheckResult: 'positive',
            notes: 'Natural mating',
            offspring: [
              { id: 'calf1', name: 'Spot', gender: 'female', birthWeight: 28.5, status: 'alive' },
            ],
          },
          {
            id: 'br3',
            femaleId: 'ls6',
            femaleName: 'Bella',
            femaleBreed: 'Jersey',
            maleId: 'ls5',
            maleName: 'Max',
            maleBreed: 'Sahiwal',
            breedingDate: new Date(2023, 5, 1),
            expectedBirthDate: new Date(2024, 2, 10),
            status: 'pregnant',
            pregnancyCheckDate: new Date(2023, 6, 15),
            pregnancyCheckResult: 'positive',
            notes: 'AI used - Sexed semen',
          },
          {
            id: 'br4',
            femaleId: 'ls4',
            femaleName: 'Molly',
            femaleBreed: 'Sahiwal',
            maleId: 'ls5',
            maleName: 'Max',
            maleBreed: 'Sahiwal',
            breedingDate: new Date(2023, 4, 20),
            expectedBirthDate: new Date(2024, 1, 30),
            status: 'open',
            pregnancyCheckDate: new Date(2023, 6, 1),
            pregnancyCheckResult: 'negative',
            notes: 'Heat synchronization used - retry next cycle',
          },
        ];

        setLivestockList(mockLivestock);
        setRecords(mockRecords);
        setFilteredRecords(mockRecords);
      } catch (error) {
        console.error('Error fetching breeding records:', error);
        toast({
          title: 'Error',
          description: 'Failed to load breeding records. Please try again.',
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
          record.femaleName.toLowerCase().includes(term) ||
          record.maleName.toLowerCase().includes(term) ||
          record.femaleBreed.toLowerCase().includes(term) ||
          record.maleBreed.toLowerCase().includes(term) ||
          record.notes?.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter((record) => record.status === statusFilter);
    }

    // Apply livestock filter
    if (livestockFilter !== 'all') {
      result = result.filter(
        (record) => record.femaleId === livestockFilter || record.maleId === livestockFilter
      );
    }

    // Apply tab filter
    if (activeTab === 'upcoming') {
      const today = new Date();
      result = result.filter(
        (record) =>
          record.status === 'pregnant' &&
          record.expectedBirthDate &&
          isAfter(new Date(record.expectedBirthDate), today)
      );
    } else if (activeTab === 'recent') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      result = result.filter(
        (record) =>
          (record.actualBirthDate && isAfter(new Date(record.actualBirthDate), thirtyDaysAgo)) ||
          (record.breedingDate && isAfter(new Date(record.breedingDate), thirtyDaysAgo))
      );
    } else if (activeTab === 'needs_attention') {
      const today = new Date();
      result = result.filter(
        (record) =>
          (record.status === 'open' && !record.pregnancyCheckDate) ||
          (record.status === 'pregnant' &&
            record.expectedBirthDate &&
            differenceInDays(new Date(record.expectedBirthDate), today) <= 14)
      );
    }

    setFilteredRecords(result);
  }, [searchTerm, statusFilter, livestockFilter, activeTab, records]);

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pregnant: { label: 'Pregnant', className: 'bg-blue-100 text-blue-800' },
      open: { label: 'Open', className: 'bg-yellow-100 text-yellow-800' },
      calved: { label: 'Calved', className: 'bg-green-100 text-green-800' },
      failed: { label: 'Failed', className: 'bg-red-100 text-red-800' },
    };

    const { label, className } = statusMap[status as keyof typeof statusMap] || {
      label: status,
      className: 'bg-gray-100 text-gray-800',
    };
    return <Badge className={`${className} text-xs`}>{label}</Badge>;
  };

  const getPregnancyBadge = (record: BreedingRecord) => {
    if (record.status !== 'pregnant') return null;

    const today = new Date();
    const daysToBirth = differenceInDays(new Date(record.expectedBirthDate), today);
    
    if (daysToBirth <= 0) {
      return <Badge variant="destructive" className="animate-pulse">Due Now</Badge>;
    } else if (daysToBirth <= 14) {
      return <Badge variant="warning">Due Soon: {daysToBirth}d</Badge>;
    } else if (daysToBirth <= 30) {
      return <Badge variant="outline">Due in {Math.ceil(daysToBirth / 7)} weeks</Badge>;
    }
    
    return <Badge variant="secondary">Pregnant</Badge>;
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), 'MMM d, yyyy');
  };

  const getFemaleLivestock = () => {
    return livestockList.filter((animal) => animal.gender === 'female');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Livestock Breeding Records</h1>
          <p className="text-gray-600">Track and manage your livestock breeding program</p>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button variant="outline" onClick={() => navigate('/livestock/breeding/heat-detection')}>
            <Droplets className="h-4 w-4 mr-2" /> Heat Detection
          </Button>
          <Button onClick={() => navigate('/livestock/breeding/add')}>
            <Plus className="h-4 w-4 mr-2" /> New Breeding Record
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full md:w-auto grid-cols-4">
          <TabsTrigger value="all">All Records</TabsTrigger>
          <TabsTrigger value="pregnant">Pregnant</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Births</TabsTrigger>
          <TabsTrigger value="needs_attention">Needs Attention</TabsTrigger>
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
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <Filter className="h-4 w-4 mr-2 text-gray-500" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pregnant">Pregnant</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="calved">Calved</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={livestockFilter} onValueChange={setLivestockFilter}>
          <SelectTrigger>
            <Filter className="h-4 w-4 mr-2 text-gray-500" />
            <SelectValue placeholder="Filter by animal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Animals</SelectItem>
            {getFemaleLivestock().map((animal) => (
              <SelectItem key={animal.id} value={animal.id}>
                {animal.name} ({animal.breed})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-blue-800">Pregnant Animals</CardTitle>
            <CardDescription className="text-blue-700">Currently expecting</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-800 mb-2">
              {records.filter((r) => r.status === 'pregnant').length}
            </div>
            <div className="text-sm text-blue-700">
              {records.filter(
                (r) =>
                  r.status === 'pregnant' &&
                  r.expectedBirthDate &&
                  differenceInDays(new Date(r.expectedBirthDate), new Date()) <= 30
              ).length}{' '}
              due in the next 30 days
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-green-800">Successful Breedings</CardTitle>
            <CardDescription className="text-green-700">Last 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-800 mb-2">
              {records.filter((r) => r.status === 'calved').length}
            </div>
            <div className="text-sm text-green-700">
              {records.filter((r) => r.offspring && r.offspring.length > 0).reduce(
                (total, record) => total + (record.offspring?.length || 0),
                0
              )}{' '}
              healthy offspring
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-amber-800">Breeding Performance</CardTitle>
            <CardDescription className="text-amber-700">Success rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-800 mb-2">75%</div>
            <div className="h-2 bg-amber-200 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: '75%' }}></div>
            </div>
            <div className="text-sm text-amber-700 mt-2">
              {records.filter((r) => r.status === 'calved').length} out of{' '}
              {records.filter((r) => r.status !== 'open').length} successful
            </div>
          </CardContent>
        </Card>
      </div>

      {filteredRecords.length === 0 ? (
        <Card className="text-center py-12">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <Search className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No breeding records found</h3>
          <p className="mt-1 text-gray-500">
            {searchTerm || statusFilter !== 'all' || livestockFilter !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'No breeding records have been added yet.'}
          </p>
          <Button className="mt-4" onClick={() => {
            setSearchTerm('');
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
                    <div className="rounded-full bg-pink-100 p-3">
                      <Heart className="h-6 w-6 text-pink-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-medium">
                          {record.femaleName} ({record.femaleBreed}) × {record.maleName} ({record.maleBreed})
                        </h3>
                        {getStatusBadge(record.status)}
                        {record.status === 'pregnant' && getPregnancyBadge(record)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                        <div>
                          <p className="text-sm text-gray-500">Breeding Date</p>
                          <p className="flex items-center">
                            <CalendarDays className="h-4 w-4 mr-1 text-gray-500" />
                            {formatDate(record.breedingDate)}
                          </p>
                        </div>
                        
                        {record.status === 'pregnant' && record.expectedBirthDate && (
                          <div>
                            <p className="text-sm text-gray-500">Expected Birth</p>
                            <p className="flex items-center">
                              <CalendarCheck className="h-4 w-4 mr-1 text-blue-500" />
                              {formatDate(record.expectedBirthDate)}
                              <span className="ml-1 text-xs text-gray-500">
                                ({differenceInDays(new Date(record.expectedBirthDate), new Date())} days)
                              </span>
                            </p>
                          </div>
                        )}
                        
                        {record.actualBirthDate && (
                          <div>
                            <p className="text-sm text-gray-500">Actual Birth</p>
                            <p className="flex items-center">
                              <Baby className="h-4 w-4 mr-1 text-green-500" />
                              {formatDate(record.actualBirthDate)}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {record.offspring && record.offspring.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Offspring:</h4>
                          <div className="flex flex-wrap gap-2">
                            {record.offspring.map((offspring) => (
                              <Badge
                                key={offspring.id}
                                variant={offspring.status === 'alive' ? 'outline' : 'secondary'}
                                className={`text-xs ${offspring.status === 'dead' ? 'line-through' : ''}`}
                              >
                                {offspring.name} ({offspring.gender.charAt(0).toUpperCase() + offspring.gender.slice(1)})
                                {offspring.birthWeight && ` • ${offspring.birthWeight}kg`}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {record.notes && (
                        <p className="text-sm text-gray-600 mt-2">
                          <span className="font-medium">Notes:</span> {record.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 md:ml-4 flex-shrink-0">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/livestock/breeding/${record.id}`)}
                      >
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => navigate(`/livestock/breeding/edit/${record.id}`)}
                      >
                        Update
                      </Button>
                    </div>
                    
                    {record.status === 'pregnant' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 w-full bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                        onClick={() => navigate(`/livestock/breeding/record-birth/${record.id}`)}
                      >
                        <Baby className="h-4 w-4 mr-1" /> Record Birth
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-800 mb-2">Breeding Calendar</h3>
        <p className="text-blue-700 mb-4">
          Track breeding cycles, heat periods, and expected birth dates with our breeding calendar.
        </p>
        <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
          View Breeding Calendar
        </Button>
      </div>
    </div>
  );
}
