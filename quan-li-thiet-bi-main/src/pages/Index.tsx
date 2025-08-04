import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Package,
  Monitor,
  TrendingUp,
  Users,
  FileText,
  Wrench,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Package className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Device Management</span>
          </div>
          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/login">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Streamline Your Equipment Management
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Complete solution for tracking, managing, and maintaining your
            equipment inventory with real-time insights and automated workflows.
          </p>
          <Link to="/login">
            <Button size="lg" className="text-lg px-8 py-6">
              Start Managing Equipment
            </Button>
          </Link>
        </section>

        {/* Features */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {[
            {
              title: "Equipment Tracking",
              description:
                "Track all your equipment with detailed information, status updates, and location management.",
              icon: Package,
            },
            {
              title: "Request Management",
              description:
                "Streamline equipment requests with approval workflows and automated notifications.",
              icon: FileText,
            },
            {
              title: "Maintenance Scheduling",
              description:
                "Schedule and track maintenance activities to keep your equipment in top condition.",
              icon: Wrench,
            },
            {
              title: "Real-time Monitoring",
              description:
                "Monitor equipment status and utilization with real-time dashboards and alerts.",
              icon: Monitor,
            },
            {
              title: "Analytics & Reports",
              description:
                "Generate detailed reports and insights to optimize your operations.",
              icon: TrendingUp,
            },
            {
              title: "Team Collaboration",
              description:
                "Enable seamless collaboration between departments and team members.",
              icon: Users,
            },
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Card key={idx} className="text-center p-6">
                <CardHeader>
                  <Icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription className="mt-2 text-sm text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </section>

        {/* CTA */}
        <section className="text-center bg-muted/50 rounded-xl p-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Transform Your Equipment Management?
          </h2>
          <p className="text-muted-foreground mb-6">
            Join thousands of organizations already using Equipment Bridge to streamline their operations.
          </p>
          <Link to="/login">
            <Button size="lg">Get Started Today</Button>
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2024 Equipment Bridge. Built with modern web technologies.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
