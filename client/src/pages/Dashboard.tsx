import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Package,
  CheckCircle,
  Monitor,
  Wrench,
  TrendingUp,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Plus,
  FileEdit,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import ProfileDropdown from "@/components/ProfileDropdown";

const Dashboard = () => {
  const email = localStorage.getItem('userEmail');
  if (!email) {
    window.location.href = '/login';
    return null;
  }

  const [equipmentStatusFilter, setEquipmentStatusFilter] = useState("all");
  const { data: stats, isLoading: loadingStats, error: errorStats } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/devices/stats/overview?email=${email}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
  });

  const { data: departmentStats = [], isLoading: loadingDept, error: errorDept } = useQuery({
    queryKey: ["departmentStats"],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/devices/stats/department?email=${email}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to fetch department stats");
      return res.json();
    },
  });

  const { data: recentRequests = [], isLoading: loadingRequests, error: errorRequests } = useQuery({
    queryKey: ["recentRequests"],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/requests?limit=3&email=${email}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to fetch recent requests");
      return res.json();
    },
  });

  if (loadingStats || loadingDept || loadingRequests) return <div className="p-6">Loading...</div>;
  if (errorStats || errorDept || errorRequests) return <div className="p-6 text-red-600">Error loading dashboard</div>;

  const statsData = [
    {
      title: "Total Equipment",
      value: stats.totalEquipment,
      change: stats.totalEquipmentChange,
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Available",
      value: stats.availableEquipment,
      change: stats.availableEquipmentChange,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "In Use",
      value: stats.inUseEquipment,
      change: stats.inUseEquipmentChange,
      icon: Monitor,
      color: "text-purple-600",
    },
    {
      title: "Maintenance Due",
      value: stats.maintenanceDue,
      change: stats.maintenanceDueChange,
      icon: Wrench,
      color: "text-orange-600",
    },
  ];

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  const priorityColors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-blue-100 text-blue-800",
  };

  const handleStatClick = (title) => {
    let filter = "all";
    if (title === "Available") filter = "available";
    if (title === "In Use") filter = "inUse";
    if (title === "Maintenance Due") filter = "maintenanceDue";
    setEquipmentStatusFilter(filter);
  };

  const getCountByFilter = (dept) => {
    if (equipmentStatusFilter === "available") return dept.available;
    if (equipmentStatusFilter === "inUse") return dept.inUse ?? dept['in_use'];
    if (equipmentStatusFilter === "maintenanceDue") return dept.maintenanceDue ?? dept['maintenance_due'];
    return dept.total;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Đã xóa header, chỉ giữ lại nội dung chính */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Title */}
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Equipment Dashboard</h2>
          <p className="text-muted-foreground">Monitor your equipment inventory and maintenance status</p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, idx) => {
            const Icon = stat.icon;
            const isActive =
              (equipmentStatusFilter === "available" && stat.title === "Available") ||
              (equipmentStatusFilter === "inUse" && stat.title === "In Use") ||
              (equipmentStatusFilter === "maintenanceDue" && stat.title === "Maintenance Due");
            return (
              <Card
                key={idx}
                className={`hover:shadow-md transition-shadow cursor-pointer ${isActive ? "ring-2 ring-primary" : ""}`}
                onClick={() => handleStatClick(stat.title)}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                    {stat.change} this month
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Requests and Department Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Equipment Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Equipment Requests
              </CardTitle>
              <CardDescription>Latest equipment requests requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loadingRequests ? (
                  <div>Loading...</div>
                ) : errorRequests ? (
                  <div className="text-red-600">Error loading requests</div>
                ) : recentRequests.length === 0 ? (
                  <div className="text-muted-foreground">No recent requests</div>
                ) : (
                  recentRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{request.title || request.item}</span>
                          <Badge variant="secondary" className={statusColors[request.status] || ""}>{request.status}</Badge>
                          <Badge variant="secondary" className={priorityColors[request.urgency || request.priority] || ""}>{request.urgency || request.priority}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{request.id} • {request.requested_by || request.requester} • {request.department}</p>
                      </div>
                    </div>
                  ))
                )}
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/requests">View All Requests</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Equipment Status Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Equipment Status Overview
              </CardTitle>
              <CardDescription>Current equipment distribution by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {departmentStats.map((dept) => {
                  const count = getCountByFilter(dept);
                  const percent = dept.total > 0 ? (count / dept.total) * 100 : 0;
                  return (
                    <div key={dept.department}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-foreground">{dept.department}</span>
                        <span className="text-sm text-muted-foreground">{count} / {dept.total} items</span>
                      </div>
                      <Progress value={percent} className="h-2" />
                    </div>
                  );
                })}
              </div>
              <Button variant="outline" className="w-full mt-6" asChild>
                <Link to="/equipment">View Equipment Details</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Quick Actions</CardTitle>
            <CardDescription>Common equipment management tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2" asChild>
                <Link to="/equipment">
                  <Plus className="h-5 w-5" />
                  Add New Equipment
                </Link>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2" asChild>
                <Link to="/requests">
                  <FileEdit className="h-5 w-5" />
                  Create Equipment Request
                </Link>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2" asChild>
                <Link to="/maintenance">
                  <Wrench className="h-5 w-5" />
                  Schedule Maintenance
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; Design by Duong Thanh Loc</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
