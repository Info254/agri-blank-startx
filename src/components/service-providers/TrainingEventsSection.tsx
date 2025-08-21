
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const TrainingEventsSection = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-12 border-t pt-8">
      <h2 className="text-2xl font-bold mb-6">Recent Training Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <Card key={n}>
            <CardHeader>
              <CardTitle className="text-lg">Advanced Potato Farming Techniques</CardTitle>
              <CardDescription>AgriTrain Kenya</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Learn advanced techniques for potato cultivation including disease management and optimal fertilization
              </p>
              
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>May 15, 2025</span>
              </div>
              
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>Meru Agricultural Training Center</span>
              </div>
              
              <div className="flex items-center text-sm">
                <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>18/30 registered</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Badge>KSh 2,500</Badge>
              <Button size="sm" onClick={() => navigate("/training-events")}>Register</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="mt-6 text-center">
        <Button variant="outline" onClick={() => navigate("/training-events")}>
          View All Events
        </Button>
      </div>
    </div>
  );
};
