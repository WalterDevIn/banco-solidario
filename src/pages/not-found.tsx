import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import "./not-found.css";

export default function NotFound() {
  return (
    <div className="not-found-page">
      <Card className="not-found-card">
        <CardContent>
          <div className="not-found-header">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="not-found-title">404 Page Not Found</h1>
          </div>

          <p className="not-found-message">
            Did you forget to add the page to the router?
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
