import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Store, 
  Truck, 
  Users, 
  TrendingUp, 
  MessageSquare,
  Building2,
  ShoppingCart
} from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

const MainNavigation: React.FC = () => {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <Store className="w-4 h-4 mr-2" />
            Marketplace
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    to="/farm-input-marketplace"
                  >
                    <ShoppingCart className="h-6 w-6" />
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Farm Input Marketplace
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Quality agricultural inputs from verified suppliers
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link to="/commodity-trading" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Commodity Trading</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Trade agricultural commodities and connect with buyers
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link to="/marketplace" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Agricultural Marketplace</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Buy fresh produce directly from farmers
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link to="/city-markets" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">City Markets</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Find agricultural markets across Kenya
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link to="/equipment-marketplace" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Equipment Marketplace</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Buy, sell, or rent agricultural equipment
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <Truck className="w-4 h-4 mr-2" />
            Logistics
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <li>
                <NavigationMenuLink asChild>
                  <Link to="/logistics" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Smart Logistics Network</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Connect with transport providers and storage facilities
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link to="/logistics-solutions-map" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Logistics Solutions Map</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Interactive map of logistics solutions
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link to="/transporter-signup" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Join as Transporter</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Register your transport services
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link to="/service-providers" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
              <Users className="w-4 h-4 mr-2" />
              Service Providers
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link to="/sentiment-analysis" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
              <TrendingUp className="w-4 h-4 mr-2" />
              Market Insights
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link to="/community-forums" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
              <MessageSquare className="w-4 h-4 mr-2" />
              Community
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link to="/city-markets" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
              <Building2 className="w-4 h-4 mr-2" />
              Markets
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MainNavigation;
