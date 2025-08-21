import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import { MapPin, Truck, Warehouse, CheckCircle, Package, User, Shield, Droplet, Activity, Cloud, Radio } from 'lucide-react';
import { ServiceProviderType } from '@/types';

// Fix for default marker icons in Next.js
// @ts-ignore
if (typeof window !== 'undefined') {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/images/marker-icon-2x.png',
    iconUrl: '/images/marker-icon.png',
    shadowUrl: '/images/marker-shadow.png',
  });
}

// Kenya bounds
export const KENYA_BOUNDS = L.latLngBounds(
  L.latLng(-4.7, 33.9), // SW
  L.latLng(5.0, 41.9)   // NE
);

// Center of Kenya
export const KENYA_CENTER: [number, number] = [0.1769, 37.9083];

// Provider type to icon mapping
export const getProviderIcon = (type: ServiceProviderType) => {
  const className = 'w-5 h-5 text-white';
  
  const iconMap: { [key in ServiceProviderType]?: JSX.Element } = {
    'transport': <Truck className={className} />,
    'storage': <Warehouse className={className} />,
    'quality-control': <CheckCircle className={className} />,
    'training': <User className={className} />,
    'input-supplier': <Package className={className} />,
    'inspector': <Shield className={className} />,
    'market-linkage': <Activity className={className} />,
    'insurance-provider': <Shield className={className} />,
    'soil-testing-provider': <Droplet className={className} />,
    'drone-satellite-imagery-provider': <Cloud className={className} />,
    'iot-sensor-data-provider': <Radio className={className} />,
    'export-transporters': <Truck className={className} />,
    'shippers': <Truck className={className} />
  };

  const defaultIcon = <MapPin className={className} />;
  
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md ${
      type === 'transport' ? 'bg-blue-500' :
      type === 'storage' ? 'bg-green-500' :
      type === 'quality-control' ? 'bg-purple-500' :
      type === 'training' ? 'bg-yellow-500' :
      type === 'input-supplier' ? 'bg-orange-500' :
      type === 'inspector' ? 'bg-red-500' :
      'bg-gray-500'
    }`}>
      {iconMap[type] || defaultIcon}
    </div>
  );
};

// Create a custom marker icon
export const createCustomIcon = (type: ServiceProviderType) => {
  const iconHtml = ReactDOMServer.renderToString(getProviderIcon(type));
  return L.divIcon({
    html: iconHtml,
    className: 'bg-transparent border-none',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};
