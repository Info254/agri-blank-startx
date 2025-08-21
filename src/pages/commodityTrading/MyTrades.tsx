import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { TransportRequest, WarehouseBooking } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, Loader2, MapPin, Package, Truck, Warehouse } from 'lucide-react';
import { MainNav } from '@/components/MainNav'; 
import { MobileNav } from '@/components/MobileNav';

const MyTrades: React.FC = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [transportRequests, setTransportRequests] = useState<TransportRequest[]>([]);
  const [warehouseBookings, setWarehouseBookings] = useState<WarehouseBooking[]>([]);
  const [selectedTransportRequest, setSelectedTransportRequest] = useState<TransportRequest | null>(null);
  const [selectedWarehouseBooking, setSelectedWarehouseBooking] = useState<WarehouseBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTransporterDialog, setSelectedTransporterDialog] = useState(false);
  const [selectedWarehouseDialog, setSelectedWarehouseDialog] = useState(false);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [processingAction, setProcessingAction] = useState(false);
  
  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setTransportRequests([
        {
          id: "tr1",
          pickupLocation: "Nakuru Farm Hub",
          dropoffLocation: "Nairobi Market",
          date: "2023-06-15",
          capacity: "2 tons",
          status: "pending",
          // Backward compatibility fields
          farmerId: "farmer123",
          farmerName: "John Kimani",
          origin: "Nakuru Farm Hub",
          destination: "Nairobi Market",
          produceType: "Potatoes",
          quantity: 2000,
          unit: "kg",
          requiredDate: "2023-06-15",
          hasSpecialRequirements: false,
          created: "2023-06-01"
        },
        {
          id: "tr2",
          pickupLocation: "Meru Cooperative",
          dropoffLocation: "Mombasa Port",
          date: "2023-06-20",
          capacity: "5 tons",
          status: "accepted",
          transporterName: "FastTrack Logistics",
          price: 15000,
          // Backward compatibility fields
          farmerId: "farmer123",
          farmerName: "John Kimani",
          origin: "Meru Cooperative",
          destination: "Mombasa Port",
          produceType: "Coffee",
          quantity: 5000,
          unit: "kg",
          requiredDate: "2023-06-20",
          hasSpecialRequirements: false,
          created: "2023-06-05"
        },
        {
          id: "tr3",
          pickupLocation: "Eldoret Grain Center",
          dropoffLocation: "Nairobi Mill",
          date: "2023-06-10",
          capacity: "10 tons",
          status: "confirmed",
          transporterName: "Heavy Haulers Ltd",
          price: 25000,
          // For full backward compatibility
          farmerId: "farmer123",
          farmerName: "John Kimani",
          origin: "Eldoret Grain Center",
          destination: "Nairobi Mill",
          produceType: "Maize",
          quantity: 10000,
          unit: "kg",
          requiredDate: "2023-06-10",
          hasSpecialRequirements: false,
          created: "2023-05-20"
        }
      ]);
      
      setWarehouseBookings([
        {
          id: "wb1",
          county: "Nairobi",
          space: "50 sq.m",
          price: 15000,
          status: "pending",
          // Backward compatibility fields
          userId: "farmer123",
          userName: "John Kimani",
          warehouseId: "wh1",
          warehouseName: "Metro Storage Solutions",
          produceType: "Potatoes",
          quantity: 5000,
          unit: "kg",
          startDate: "2023-06-15",
          endDate: "2023-07-15",
          requiresRefrigeration: false,
          created: "2023-06-01"
        },
        {
          id: "wb2",
          county: "Mombasa",
          space: "100 sq.m",
          price: 28000,
          status: "confirmed",
          // Backward compatibility fields
          userId: "farmer123",
          userName: "John Kimani",
          warehouseId: "wh2",
          warehouseName: "Coast Cold Storage",
          produceType: "French Beans",
          quantity: 2000,
          unit: "kg",
          startDate: "2023-06-10",
          endDate: "2023-06-25",
          requiresRefrigeration: true,
          created: "2023-05-28"
        }
      ]);
      
      setLoading(false);
    }, 1500);
  }, []);

  const handleCancelTransportRequest = async () => {
    if (!selectedTransportRequest) return;
    setProcessingAction(true);
    
    // Simulate API call
    setTimeout(() => {
      setTransportRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === selectedTransportRequest.id ? { ...req, status: 'cancelled' } : req
        )
      );
      setCancelDialog(false);
      setProcessingAction(false);
      toast({
        title: "Request cancelled",
        description: "Your transport request has been cancelled successfully.",
      });
    }, 1000);
  };
  
  const handleConfirmTransportRequest = async () => {
    if (!selectedTransportRequest) return;
    setProcessingAction(true);
    
    // Simulate API call
    setTimeout(() => {
      setTransportRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === selectedTransportRequest.id ? { ...req, status: 'confirmed' } : req
        )
      );
      setConfirmDialog(false);
      setProcessingAction(false);
      toast({
        title: "Request confirmed",
        description: "You have confirmed the transport request.",
      });
    }, 1000);
  };
  
  const handleCancelWarehouseBooking = async () => {
    if (!selectedWarehouseBooking) return;
    setProcessingAction(true);
    
    // Simulate API call
    setTimeout(() => {
      setWarehouseBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === selectedWarehouseBooking.id ? { ...booking, status: 'cancelled' } : booking
        )
      );
      setCancelDialog(false);
      setProcessingAction(false);
      toast({
        title: "Booking cancelled",
        description: "Your warehouse booking has been cancelled successfully.",
      });
    }, 1000);
  };

  const transportStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'accepted':
        return <Badge variant="secondary">Accepted</Badge>;
      case 'completed':
        return <Badge variant="default">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      case 'confirmed':
        return <Badge variant="secondary">Confirmed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const warehouseStatusBadge = (status: string) => {
    if (!status) return <Badge variant="outline">Pending</Badge>;
    
    switch(status.toLowerCase()) {
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'confirmed':
        return <Badge variant="secondary">Confirmed</Badge>;
      case 'active':
        return <Badge variant="default">Active</Badge>;
      case 'completed':
        return <Badge variant="default">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center">
          <div className="hidden md:block">
            <MainNav />
          </div>
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-1">My Trades</h1>
              <p className="text-muted-foreground">Manage your transport requests and warehouse bookings</p>
            </div>
          </div>

          <Tabs defaultValue="transport" className="w-full">
            <TabsList className="grid w-full md:w-[400px] grid-cols-2">
              <TabsTrigger value="transport">Transport Requests</TabsTrigger>
              <TabsTrigger value="warehouse">Warehouse Bookings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="transport" className="py-4">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : transportRequests.length === 0 ? (
                <div className="text-center py-20">
                  <Truck className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h2 className="text-xl font-semibold mb-2">No transport requests yet</h2>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    You haven't made any transport requests yet. Request transport to move your produce to market or storage.
                  </p>
                  <Button>Request Transport</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {transportRequests.map((request) => (
                    <Card key={request.id} className="h-full flex flex-col">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{request.origin} to {request.destination}</CardTitle>
                            <CardDescription>
                              {request.produceType} • {request.quantity} {request.unit}
                            </CardDescription>
                          </div>
                          {transportStatusBadge(request.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>Needed by {new Date(request.requiredDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center">
                            <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{request.quantity} {request.unit}</span>
                          </div>
                          {request.transporterName && (
                            <div className="flex items-center">
                              <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{request.transporterName}</span>
                            </div>
                          )}
                          {request.price && (
                            <div className="flex items-center font-medium">
                              Price: KES {request.price.toLocaleString()}
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <div className="w-full">
                          {request.status === "pending" && (
                            <Button 
                              variant="destructive" 
                              className="w-full" 
                              onClick={() => {
                                setSelectedTransportRequest(request);
                                setCancelDialog(true);
                              }}
                            >
                              Cancel Request
                            </Button>
                          )}
                          {request.status === "accepted" && (
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                className="flex-1"
                                onClick={() => {
                                  setSelectedTransportRequest(request);
                                  setSelectedTransporterDialog(true);
                                }}
                              >
                                View Details
                              </Button>
                              <Button 
                                variant="default" 
                                className="flex-1"
                                onClick={() => {
                                  setSelectedTransportRequest(request);
                                  setConfirmDialog(true);
                                }}
                              >
                                Confirm
                              </Button>
                            </div>
                          )}
                          {(request.status === "confirmed" || request.status === "completed") && (
                            <Button 
                              variant="outline" 
                              className="w-full"
                              onClick={() => {
                                setSelectedTransportRequest(request);
                                setSelectedTransporterDialog(true);
                              }}
                            >
                              View Details
                            </Button>
                          )}
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="warehouse" className="py-4">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : warehouseBookings.length === 0 ? (
                <div className="text-center py-20">
                  <Warehouse className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h2 className="text-xl font-semibold mb-2">No warehouse bookings yet</h2>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    You haven't made any warehouse bookings yet. Book warehouse space to store your produce.
                  </p>
                  <Button>Find Warehouse</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {warehouseBookings.map((booking) => (
                    <Card key={booking.id} className="h-full flex flex-col">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{booking.warehouseName}</CardTitle>
                            <CardDescription>
                              {booking.produceType} • {booking.quantity} {booking.unit}
                            </CardDescription>
                          </div>
                          {warehouseStatusBadge(booking.status || 'pending')}
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{booking.county}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center">
                            <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{booking.space}</span>
                          </div>
                          <div className="flex items-center font-medium">
                            Price: KES {booking.price.toLocaleString()}
                          </div>
                          {booking.requiresRefrigeration && (
                            <Badge variant="outline" className="mt-1">Refrigerated</Badge>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <div className="w-full">
                          {!booking.status || booking.status === "pending" ? (
                            <Button 
                              variant="destructive" 
                              className="w-full"
                              onClick={() => {
                                setSelectedWarehouseBooking(booking);
                                setCancelDialog(true);
                              }}
                            >
                              Cancel Booking
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              className="w-full"
                              onClick={() => {
                                setSelectedWarehouseBooking(booking);
                                setSelectedWarehouseDialog(true);
                              }}
                            >
                              View Details
                            </Button>
                          )}
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      {/* Transport Request Details Dialog */}
      <Dialog open={selectedTransporterDialog} onOpenChange={setSelectedTransporterDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Transport Request Details</DialogTitle>
            <DialogDescription>
              View details about your transport request
            </DialogDescription>
          </DialogHeader>
          
          {selectedTransportRequest && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Pickup Location</label>
                  <p className="mt-1 text-sm text-gray-500">{selectedTransportRequest.pickupLocation}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Dropoff Location</label>
                  <p className="mt-1 text-sm text-gray-500">{selectedTransportRequest.dropoffLocation}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Produce Type</label>
                  <p className="mt-1 text-sm text-gray-500">{selectedTransportRequest.produceType}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantity</label>
                  <p className="mt-1 text-sm text-gray-500">{selectedTransportRequest.quantity} {selectedTransportRequest.unit}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Required Date</label>
                  <p className="mt-1 text-sm text-gray-500">{new Date(selectedTransportRequest.requiredDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <p className="mt-1 text-sm text-gray-500">{selectedTransportRequest.status}</p>
                </div>
              </div>
              
              {selectedTransportRequest.transporterName && (
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Transporter Name</label>
                    <p className="mt-1 text-sm text-gray-500">{selectedTransportRequest.transporterName}</p>
                  </div>
                  {selectedTransportRequest.price && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Price</label>
                      <p className="mt-1 text-sm text-gray-500">KES {selectedTransportRequest.price.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedTransporterDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Warehouse Booking Details Dialog */}
      <Dialog open={selectedWarehouseDialog} onOpenChange={setSelectedWarehouseDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Warehouse Booking Details</DialogTitle>
            <DialogDescription>
              View details about your warehouse booking
            </DialogDescription>
          </DialogHeader>
          
          {selectedWarehouseBooking && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Warehouse Name</label>
                  <p className="mt-1 text-sm text-gray-500">{selectedWarehouseBooking.warehouseName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">County</label>
                  <p className="mt-1 text-sm text-gray-500">{selectedWarehouseBooking.county}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Produce Type</label>
                  <p className="mt-1 text-sm text-gray-500">{selectedWarehouseBooking.produceType}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantity</label>
                  <p className="mt-1 text-sm text-gray-500">{selectedWarehouseBooking.quantity} {selectedWarehouseBooking.unit}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <p className="mt-1 text-sm text-gray-500">{new Date(selectedWarehouseBooking.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <p className="mt-1 text-sm text-gray-500">{new Date(selectedWarehouseBooking.endDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Space</label>
                  <p className="mt-1 text-sm text-gray-500">{selectedWarehouseBooking.space}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <p className="mt-1 text-sm text-gray-500">KES {selectedWarehouseBooking.price.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedWarehouseDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialog} onOpenChange={setCancelDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cancel Confirmation</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this request? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialog(false)} disabled={processingAction}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (selectedTransportRequest) {
                  handleCancelTransportRequest();
                } else if (selectedWarehouseBooking) {
                  handleCancelWarehouseBooking();
                }
              }} 
              disabled={processingAction}
            >
              {processingAction ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Confirm Cancel"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Confirm Transport Request Dialog */}
      <Dialog open={confirmDialog} onOpenChange={setConfirmDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Transport Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to confirm this transport request?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialog(false)} disabled={processingAction}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={handleConfirmTransportRequest} 
              disabled={processingAction}
            >
              {processingAction ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Confirming...
                </>
              ) : (
                "Confirm Request"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyTrades;
