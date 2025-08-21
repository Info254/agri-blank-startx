
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const ProviderHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Service Providers Directory</h1>
        <p className="text-muted-foreground mt-2">
          Find and connect with agricultural service providers across Kenya
        </p>
      </div>
      <div className="mt-4 md:mt-0">
        <Button onClick={() => navigate("/service-provider-registration")}>
          Register as a Provider
        </Button>
      </div>
    </div>
  );
};
