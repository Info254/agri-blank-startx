
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-6">
        <h1 className="text-6xl font-bold mb-4 text-gray-800">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
        <div className="max-w-md mx-auto">
          <p className="text-gray-500 mb-6">
            The page you're looking for doesn't exist or may have been moved.
          </p>
          <Link to="/" className="text-blue-500 hover:text-blue-700 underline block mb-4">
            Return to Home
          </Link>
          
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h2 className="text-lg font-medium mb-4">You might be interested in:</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/sentiment-analysis">
                <Button variant="outline" className="w-full">
                  Sentiment Analysis
                </Button>
              </Link>
              <Link to="/market-demand-hotspot">
                <Button variant="outline" className="w-full">
                  Market Demand Hotspots
                </Button>
              </Link>
              <Link to="/farmer-success-stories">
                <Button variant="outline" className="w-full">
                  Farmer Success Stories
                </Button>
              </Link>
              <Link to="/commodity-trading">
                <Button variant="outline" className="w-full">
                  Commodity Trading
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
