import { Link, useLocation } from "react-router-dom";
import { Package, LayoutDashboard, Wrench, FileText, BarChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import ProfileDropdown from "@/components/ProfileDropdown";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { logout } = useAuth();

  const navigation = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Equipment",
      href: "/equipment",
      icon: Package,
    },
    {
      title: "Requests",
      href: "/requests",
      icon: FileText,
    },
    {
      title: "Maintenance",
      href: "/maintenance",
      icon: Wrench,
    },
    {
      title: "Reports",
      href: "/reports",
      icon: BarChart,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header giống Dashboard */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Package className="h-8 w-8 text-primary" />
              <Link to="/dashboard" className="text-2xl font-bold text-foreground hover:text-primary transition-colors">
                Device Management
              </Link>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={
                    location.pathname === item.href
                      ? "font-bold text-foreground"
                      : "font-normal text-muted-foreground hover:text-foreground transition-colors"
                  }
                >
                  {item.title}
                </Link>
              ))}
              <ProfileDropdown />
            </nav>
          </div>
        </div>
      </header>
      {/* Main Content */}
      {children}
    </div>
  );
};

export default Layout; 