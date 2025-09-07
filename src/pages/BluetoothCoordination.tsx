// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { MainNav } from "@/components/MainNav";
import { MobileNav } from "@/components/MobileNav";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Bluetooth, 
  Users, 
  MapPin, 
  Clock, 
  Bell, 
  Wifi, 
  Car, 
  DollarSign,
  Signal,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BluetoothDevice {
  id: string;
  name: string;
  type: 'farmer' | 'buyer' | 'transporter';
  location: string;
  coordinates: { lat: number; lng: number };
  distance: number;
  lastSeen: Date;
  services: string[];
  priceAlerts?: PriceAlert[];
  transportOffers?: TransportOffer[];
}

interface PriceAlert {
  id: string;
  commodity: string;
  targetPrice: number;
  currentPrice: number;
  priceDirection: 'up' | 'down';
  urgency: 'low' | 'medium' | 'high';
}

interface TransportOffer {
  id: string;
  from: string;
  to: string;
  availableSpace: number;
  pricePerKg: number;
  departureTime: Date;
  vehicleType: string;
}

const BluetoothCoordination: React.FC = () => {
  const { toast } = useToast();
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState<BluetoothDevice[]>([]);
  const [discoveredDevices, setDiscoveredDevices] = useState<BluetoothDevice[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);

  useEffect(() => {
    // Check for Bluetooth support
    if ('bluetooth' in navigator) {
      checkBluetoothSupport();
    }

    // Initialize mock data for demonstration
    initializeMockData();
  }, []);

  const checkBluetoothSupport = async () => {
    try {
      const availability = await navigator.bluetooth.getAvailability();
      setBluetoothEnabled(availability);
      
      if (availability) {
        toast({
          title: "Bluetooth Ready",
          description: "Bluetooth mesh networking is available on this device",
        });
      }
    } catch (error) {
      console.error('Bluetooth not available:', error);
    }
  };

  const initializeMockData = () => {
    // Mock discovered devices
    const mockDevices: BluetoothDevice[] = [
      {
        id: '1',
        name: 'John Farmer',
        type: 'farmer',
        location: 'Kijabe Market',
        coordinates: { lat: -0.9167, lng: 36.5833 },
        distance: 0.5,
        lastSeen: new Date(Date.now() - 5 * 60000), // 5 minutes ago
        services: ['Price Alerts', 'Transport Sharing'],
        priceAlerts: [
          {
            id: '1',
            commodity: 'Maize',
            targetPrice: 45,
            currentPrice: 42,
            priceDirection: 'up',
            urgency: 'medium'
          }
        ]
      },
      {
        id: '2',
        name: 'Mary Transporter',
        type: 'transporter',
        location: 'Uplands Market',
        coordinates: { lat: -0.8833, lng: 36.5500 },
        distance: 1.2,
        lastSeen: new Date(Date.now() - 2 * 60000), // 2 minutes ago
        services: ['Transport Services', 'Group Coordination'],
        transportOffers: [
          {
            id: '1',
            from: 'Uplands',
            to: 'Nairobi',
            availableSpace: 500,
            pricePerKg: 2.5,
            departureTime: new Date(Date.now() + 2 * 60 * 60000), // 2 hours from now
            vehicleType: 'Truck'
          }
        ]
      },
      {
        id: '3',
        name: 'Peter Buyer',
        type: 'buyer',
        location: 'Limuru Market',
        coordinates: { lat: -1.1167, lng: 36.6500 },
        distance: 2.1,
        lastSeen: new Date(Date.now() - 1 * 60000), // 1 minute ago
        services: ['Group Buying', 'Price Alerts'],
        priceAlerts: [
          {
            id: '2',
            commodity: 'Coffee',
            targetPrice: 120,
            currentPrice: 125,
            priceDirection: 'down',
            urgency: 'high'
          }
        ]
      }
    ];

    setDiscoveredDevices(mockDevices);

    // Mock price alerts
    const alerts: PriceAlert[] = [
      {
        id: '1',
        commodity: 'Tomatoes',
        targetPrice: 60,
        currentPrice: 65,
        priceDirection: 'down',
        urgency: 'medium'
      },
      {
        id: '2',
        commodity: 'Cabbage',
        targetPrice: 25,
        currentPrice: 23,
        priceDirection: 'up',
        urgency: 'high'
      }
    ];

    setPriceAlerts(alerts);
  };

  const startBluetoothScan = async () => {
    if (!bluetoothEnabled) {
      toast({
        title: "Bluetooth Not Available",
        description: "Please enable Bluetooth to discover nearby devices",
        variant: "destructive"
      });
      return;
    }

    setIsScanning(true);
    
    try {
      // In a real implementation, this would use Web Bluetooth API
      // For now, simulate discovery
      setTimeout(() => {
        setIsScanning(false);
        toast({
          title: "Scan Complete",
          description: `Found ${discoveredDevices.length} nearby agricultural devices`,
        });
      }, 3000);

    } catch (error) {
      console.error('Bluetooth scan failed:', error);
      setIsScanning(false);
      toast({
        title: "Scan Failed",
        description: "Unable to scan for nearby devices",
        variant: "destructive"
      });
    }
  };

  const connectToDevice = async (device: BluetoothDevice) => {
    try {
      // Simulate connection
      setConnectedDevices(prev => [...prev, device]);
      setDiscoveredDevices(prev => prev.filter(d => d.id !== device.id));
      
      toast({
        title: "Device Connected",
        description: `Connected to ${device.name}. You can now share transport and receive price alerts.`,
      });

      // Simulate receiving price alerts from connected device
      if (device.priceAlerts) {
        setTimeout(() => {
          setPriceAlerts(prev => [...prev, ...device.priceAlerts!]);
        }, 2000);
      }

    } catch (error) {
      console.error('Connection failed:', error);
      toast({
        title: "Connection Failed",
        description: `Unable to connect to ${device.name}`,
        variant: "destructive"
      });
    }
  };

  const disconnectDevice = (deviceId: string) => {
    const device = connectedDevices.find(d => d.id === deviceId);
    if (device) {
      setConnectedDevices(prev => prev.filter(d => d.id !== deviceId));
      setDiscoveredDevices(prev => [...prev, device]);
      
      toast({
        title: "Device Disconnected",
        description: `Disconnected from ${device.name}`,
      });
    }
  };

  const getDeviceTypeIcon = (type: string) => {
    switch (type) {
      case 'farmer': return '🌾';
      case 'buyer': return '🛒';
      case 'transporter': return '🚚';
      default: return '📱';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <MainNav />
            <MobileNav />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bluetooth Mesh Coordination
          </h1>
          <p className="text-gray-600">
            Connect with nearby farmers, buyers, and transporters for coordinated agriculture activities
          </p>
        </div>

        {/* Bluetooth Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <div className={`p-3 rounded-full ${bluetoothEnabled ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <Bluetooth className={`h-6 w-6 ${bluetoothEnabled ? 'text-blue-600' : 'text-gray-400'}`} />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-600">Bluetooth Status</div>
                <div className={`text-lg font-semibold ${bluetoothEnabled ? 'text-blue-600' : 'text-gray-400'}`}>
                  {bluetoothEnabled ? 'Active' : 'Inactive'}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="p-3 rounded-full bg-green-100">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-600">Connected Devices</div>
                <div className="text-lg font-semibold text-green-600">{connectedDevices.length}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="p-3 rounded-full bg-orange-100">
                <Bell className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-600">Active Alerts</div>
                <div className="text-lg font-semibold text-orange-600">{priceAlerts.length}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Device Discovery */}
          <div>
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Nearby Devices</CardTitle>
                  <Button 
                    onClick={startBluetoothScan}
                    disabled={isScanning || !bluetoothEnabled}
                    size="sm"
                  >
                    {isScanning ? (
                      <>
                        <Signal className="h-4 w-4 mr-2 animate-pulse" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Bluetooth className="h-4 w-4 mr-2" />
                        Scan
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {!bluetoothEnabled && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Bluetooth is required for mesh coordination. Please enable Bluetooth and refresh.
                    </AlertDescription>
                  </Alert>
                )}

                {discoveredDevices.map((device) => (
                  <div key={device.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">{getDeviceTypeIcon(device.type)}</span>
                        <div>
                          <div className="font-medium">{device.name}</div>
                          <div className="text-sm text-gray-600 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {device.location} • {device.distance} km
                          </div>
                        </div>
                      </div>
                      <Button size="sm" onClick={() => connectToDevice(device)}>
                        Connect
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-2">
                      {device.services.map((service, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>

                    <div className="text-xs text-gray-500">
                      Last seen {Math.floor((Date.now() - device.lastSeen.getTime()) / 60000)} minutes ago
                    </div>
                  </div>
                ))}

                {discoveredDevices.length === 0 && !isScanning && (
                  <div className="text-center py-6 text-gray-500">
                    No devices found. Tap scan to discover nearby agricultural devices.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Connected Devices */}
            {connectedDevices.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Connected Devices</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {connectedDevices.map((device) => (
                    <div key={device.id} className="border rounded-lg p-4 bg-green-50">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <span className="text-2xl mr-2">{getDeviceTypeIcon(device.type)}</span>
                          <div>
                            <div className="font-medium">{device.name}</div>
                            <div className="text-sm text-gray-600">Connected</div>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => disconnectDevice(device.id)}
                        >
                          Disconnect
                        </Button>
                      </div>

                      {device.transportOffers && device.transportOffers.length > 0 && (
                        <div className="mt-3 p-2 bg-blue-50 rounded">
                          <div className="text-xs font-medium text-blue-900 mb-1">Transport Available</div>
                          {device.transportOffers.map((offer, index) => (
                            <div key={index} className="text-xs text-blue-700">
                              {offer.from} → {offer.to} | {offer.availableSpace}kg available | 
                              KSh {offer.pricePerKg}/kg
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Price Alerts */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Real-time Price Alerts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {priceAlerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`border rounded-lg p-4 ${getUrgencyColor(alert.urgency)}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium">{alert.commodity}</div>
                        <div className="text-sm">
                          Target: KSh {alert.targetPrice} | Current: KSh {alert.currentPrice}
                        </div>
                      </div>
                      <Badge variant={alert.urgency === 'high' ? 'destructive' : 'default'}>
                        {alert.urgency.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <DollarSign className="h-4 w-4 mr-1" />
                      Price trending {alert.priceDirection}
                      {alert.priceDirection === 'up' ? '📈' : '📉'}
                    </div>
                  </div>
                ))}

                {priceAlerts.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    No active price alerts. Connect to devices to receive real-time price updates.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Coordination Features */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Coordination Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-auto p-4 flex flex-col">
                    <Car className="h-8 w-8 mb-2 text-blue-600" />
                    <span className="text-sm font-medium">Transport Sharing</span>
                    <span className="text-xs text-gray-600">Coordinate shared transport</span>
                  </Button>
                  
                  <Button variant="outline" className="h-auto p-4 flex flex-col">
                    <Users className="h-8 w-8 mb-2 text-green-600" />
                    <span className="text-sm font-medium">Group Buying</span>
                    <span className="text-xs text-gray-600">Join buying groups</span>
                  </Button>
                  
                  <Button variant="outline" className="h-auto p-4 flex flex-col">
                    <Bell className="h-8 w-8 mb-2 text-orange-600" />
                    <span className="text-sm font-medium">Price Alerts</span>
                    <span className="text-xs text-gray-600">Real-time price updates</span>
                  </Button>
                  
                  <Button variant="outline" className="h-auto p-4 flex flex-col">
                    <Wifi className="h-8 w-8 mb-2 text-purple-600" />
                    <span className="text-sm font-medium">Mesh Network</span>
                    <span className="text-xs text-gray-600">Offline communication</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BluetoothCoordination;