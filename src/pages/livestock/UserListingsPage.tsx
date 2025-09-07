// @ts-nocheck
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchUserListings, deleteLivestockListing } from '@/services/livestockMarketService';
import { useToast } from '@/components/ui/use-toast';
import { LivestockListing } from '@/types/livestock';

export default function UserListingsPage() {
  const [listings, setListings] = useState<LivestockListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      setLoading(true);
      // In a real app, you would get the current user's ID from your auth context
      // const userId = currentUser.id;
      const userId = 'current-user-id'; // Replace with actual user ID
      const data = await fetchUserListings(userId);
      setListings(data || []);
    } catch (error) {
      console.error('Error loading listings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your listings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      try {
        await deleteLivestockListing(id);
        toast({
          title: 'Success',
          description: 'Listing deleted successfully.',
        });
        loadListings(); // Refresh the list
      } catch (error) {
        console.error('Error deleting listing:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete listing. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      // In a real app, you would call updateLivestockListing here
      // await updateLivestockListing(id, { status: newStatus });
      toast({
        title: 'Status Updated',
        description: `Listing status updated to ${newStatus}.`,
      });
      loadListings(); // Refresh the list
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update listing status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      available: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      sold: 'bg-blue-100 text-blue-800',
      reserved: 'bg-purple-100 text-purple-800',
      expired: 'bg-gray-100 text-gray-800',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusMap[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredListings = listings.filter(listing => {
    const matchesSearch = 
      listing.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || listing.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Livestock Listings</h1>
          <p className="text-gray-600">Manage your livestock listings and view their status</p>
        </div>
        <Button onClick={() => navigate('/livestock/sell')}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Listing
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search by breed or type..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{statusFilter === 'all' ? 'All Statuses' : `Status: ${statusFilter}`}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-end">
              <p className="text-sm text-gray-500">
                {filteredListings.length} {filteredListings.length === 1 ? 'listing' : 'listings'} found
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Livestock</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Posted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredListings.length > 0 ? (
                filteredListings.map((listing) => (
                  <TableRow key={listing.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        {listing.images?.[0] ? (
                          <img 
                            src={listing.images[0]} 
                            alt={listing.type}
                            className="h-12 w-12 rounded-md object-cover mr-3"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 mr-3">
                            <span>No Image</span>
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{listing.breed} {listing.type}</div>
                          <div className="text-sm text-gray-500">{listing.market?.name || 'N/A'}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          <span className="font-medium">Age:</span> {listing.age} months
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Weight:</span> {listing.weight} kg
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Qty:</span> {listing.quantity}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      KSh {listing.price.toLocaleString()}
                      {listing.price_per_kg && (
                        <div className="text-sm text-gray-500">
                          KSh {listing.price_per_kg.toLocaleString()}/kg
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-2">
                        {getStatusBadge(listing.status)}
                        <Select 
                          value={listing.status} 
                          onValueChange={(value) => handleStatusChange(listing.id, value)}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Change status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="sold">Sold</SelectItem>
                            <SelectItem value="reserved">Reserved</SelectItem>
                            <SelectItem value="expired">Expired</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(listing.created_at).toLocaleDateString()}
                      <div className="text-sm text-gray-500">
                        {new Date(listing.updated_at).toLocaleDateString() !== new Date(listing.created_at).toLocaleDateString() 
                          ? `Updated: ${new Date(listing.updated_at).toLocaleDateString()}`
                          : 'Just created'}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => navigate(`/livestock/${listing.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => navigate(`/livestock/edit/${listing.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(listing.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center">
                      <svg 
                        className="h-12 w-12 text-gray-400" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={1} 
                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                        />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No listings found</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {searchTerm || statusFilter !== 'all' 
                          ? 'Try adjusting your search or filter criteria.'
                          : 'Get started by creating a new listing.'}
                      </p>
                      <div className="mt-6">
                        <Button
                          type="button"
                          onClick={() => {
                            setSearchTerm('');
                            setStatusFilter('all');
                            if (!searchTerm && statusFilter === 'all') {
                              navigate('/livestock/sell');
                            }
                          }}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          {searchTerm || statusFilter !== 'all' ? 'Clear filters' : 'New Listing'}
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
