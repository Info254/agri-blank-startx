
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { User, LogOut, Settings } from 'lucide-react';
import { ModeToggle } from './ModeToggle';
import MainNavigation from './MainNavigation';

const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const CustomLogo = () => (
    <div className="w-8 h-8 flex items-center justify-center">
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <g transform="translate(50, 50)">
          <path d="M-15 15 L0 -25 L15 15 L8 10 L0 -10 L-8 10 Z" fill="url(#dynamicGradient)" />
          
          <path d="M-12 5 Q-20 0 -18 8 Q-12 12 -8 8 Q-6 2 -12 5 Z" fill="#22c55e" opacity="0.9"/>
          <path d="M12 5 Q20 0 18 8 Q12 12 8 8 Q6 2 12 5 Z" fill="#22c55e" opacity="0.9"/>
          
          <g opacity="0.7">
            <line x1="0" y1="-25" x2="8" y2="-32" stroke="#4ade80" strokeWidth="2" strokeLinecap="round"/>
            <line x1="0" y1="-25" x2="-8" y2="-32" stroke="#4ade80" strokeWidth="2" strokeLinecap="round"/>
            <line x1="0" y1="-25" x2="0" y2="-35" stroke="#4ade80" strokeWidth="2" strokeLinecap="round"/>
            
            <circle cx="8" cy="-32" r="2" fill="#4ade80"/>
            <circle cx="-8" cy="-32" r="2" fill="#4ade80"/>
            <circle cx="0" cy="-35" r="2" fill="#4ade80"/>
          </g>
          
          <g opacity="0.6">
            <path d="M-5 15 Q-10 20 -15 18 Q-12 22 -8 20 Q-5 18 -5 15" stroke="#16a34a" strokeWidth="2" fill="none"/>
            <path d="M5 15 Q10 20 15 18 Q12 22 8 20 Q5 18 5 15" stroke="#16a34a" strokeWidth="2" fill="none"/>
            <path d="M0 15 Q0 22 -3 25 Q3 25 0 15" stroke="#16a34a" strokeWidth="2" fill="none"/>
          </g>
          
          <circle cx="0" cy="0" r="25" fill="none" stroke="#4ade80" strokeWidth="1" opacity="0.3" className="pulse-ring"/>
          <circle cx="0" cy="0" r="35" fill="none" stroke="#22c55e" strokeWidth="1" opacity="0.2" className="pulse-ring-2"/>
        </g>
        
        <defs>
          <linearGradient id="dynamicGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" style={{stopColor:"#16a34a", stopOpacity:1}} />
            <stop offset="50%" style={{stopColor:"#22c55e", stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:"#4ade80", stopOpacity:1}} />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <CustomLogo />
              <span className="text-xl font-bold text-primary">SokoConnect</span>
            </Link>
            <MainNavigation />
          </div>
          
          <div className="flex items-center space-x-4">
            <ModeToggle />
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt="Profile" />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.user_metadata?.full_name || user.email}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
