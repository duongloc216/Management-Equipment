import { useQuery } from "@tanstack/react-query";
import {
  Package,
  FileText,
  Calendar,
  TrendingUp,
  BarChart3,
  PieChart,
  Users,
  Monitor,
  Download,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { saveAs } from "file-saver";
import { useAuth } from "@/contexts/AuthContext";

const Reports = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  const email = localStorage.getItem('userEmail');
  if (!email) {
    window.location.href = '/login';
    return null;
  }

  const fetchRequests = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:5000/api/requests?email=${email}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error("Failed to fetch requests");
    return res.json();
  };

  const fetchReportOverview = async () => {
    const token = localStorage.getItem('token');
    const endpoint = user?.role === 'admin' ? '/api/reports/overview' : '/api/reports/user-overview';
    const res = await fetch(`http://localhost:5000${endpoint}?email=${email}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error("Failed to fetch report overview");
    return res.json();
  };

  const fetchDepartmentStats = async () => {
    const token = localStorage.getItem('token');
    // User thường cũng có thể xem thống kê department equipment
    const res = await fetch(`http://localhost:5000/api/devices/stats/department?email=${email}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error("Failed to fetch department stats");
    return res.json();
  };

  const {
    data: requests = [],
    isLoading: loadingRequests,
    error: errorRequests,
  } = useQuery({ queryKey: ["requests"], queryFn: fetchRequests });

  const { data: report, isLoading: loadingReport, error: errorReport } = useQuery({
    queryKey: ["reportOverview"],
    queryFn: fetchReportOverview,
  });

  const { data: departmentStats = [], isLoading: loadingDept, error: errorDept } = useQuery({
    queryKey: ["departmentStats"],
    queryFn: fetchDepartmentStats,
  });

  const handleGenerateReport = async (reportType: string) => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = user?.role === 'admin' ? '/api/reports/export' : '/api/reports/export-user';
      const res = await fetch(`http://localhost:5000${endpoint}?type=${encodeURIComponent(reportType)}&email=${email}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to export report");
      const blob = await res.blob();
      saveAs(blob, `${reportType.replace(/\s+/g, "_")}.xlsx`);
    } catch (err) {
      toast({ title: "Export Error", description: err.message, variant: "destructive" });
    }
  };

  const handleCustomReport = async (reportType: string) => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = '/api/reports/export-user';
      const res = await fetch(`http://localhost:5000${endpoint}?type=${encodeURIComponent(reportType)}&email=${email}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to export report");
      const blob = await res.blob();
      saveAs(blob, `${reportType.replace(/\s+/g, "_")}.xlsx`);
    } catch (err) {
      toast({ title: "Export Error", description: err.message, variant: "destructive" });
    }
  };

  if (loadingRequests || loadingReport || loadingDept)
    return <div className="p-4">Loading...</div>;
  if (errorRequests || errorReport || errorDept)
    return <div className="p-4 text-red-500">Error loading reports</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Reports & Analytics</h1>
        <p className="text-muted-foreground">Generate insights and reports on equipment usage and performance</p>
      </div>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="rounded-xl shadow p-6">
          <div className="text-sm text-muted-foreground mb-1 flex items-center gap-2"><Monitor className="h-4 w-4" /> Equipment Utilization</div>
          <div className="text-2xl font-bold">{report?.equipmentUtilization ?? "N/A"}%</div>
          <div className="text-xs text-green-600">
            {user?.role === 'admin' ? (report?.equipmentUtilizationChange ?? "") : `Your department: ${report?.userDepartment ?? "N/A"}`}
          </div>
        </Card>
        <Card className="rounded-xl shadow p-6">
          <div className="text-sm text-muted-foreground mb-1 flex items-center gap-2"><Users className="h-4 w-4" /> {user?.role === 'admin' ? 'Active Users' : 'Your Activity'}</div>
          <div className="text-2xl font-bold">{report?.activeUsers ?? "N/A"}</div>
          <div className="text-xs text-green-600">
            {user?.role === 'admin' ? (report?.activeUsersChange ?? "") : `Your requests: ${report?.userRequests ?? "N/A"}`}
          </div>
        </Card>
        <Card className="rounded-xl shadow p-6">
          <div className="text-sm text-muted-foreground mb-1 flex items-center gap-2"><FileText className="h-4 w-4" /> Monthly Requests</div>
          <div className="text-2xl font-bold">{report?.monthlyRequests ?? "N/A"}</div>
          <div className="text-xs text-green-600">
            {user?.role === 'admin' ? (report?.monthlyRequestsChange ?? "") : "This month"}
          </div>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Department Equipment Utilization */}
        <Card className="rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" /> Department Equipment Utilization
          </h2>
          <p className="text-muted-foreground mb-4">Equipment usage across different departments</p>
          <div className="space-y-6">
            {departmentStats.map((dept) => {
              const utilization = dept.total > 0 ? Math.round(((dept.inUse + dept.available) / dept.total) * 100) : 0;
              return (
                <div key={dept.department}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{dept.department}</span>
                    <span className="text-sm text-muted-foreground">
                      {dept.total} items • {utilization}%
                    </span>
                  </div>
                  <Progress value={utilization} />
                </div>
              );
            })}
          </div>
        </Card>

        {/* Quick Reports */}
        <Card className="rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <FileText className="h-5 w-5" /> {user?.role === 'admin' ? 'Quick Reports' : 'Your Reports'}
          </h2>
          <p className="text-muted-foreground mb-4">
            {user?.role === 'admin' ? 'Generate commonly used reports instantly' : 'View your personal reports and activities'}
          </p>
          <div className="space-y-4">
            {user?.role === 'admin' ? (
              (report?.quickReports || [
                { title: "Equipment Inventory Report", description: "Complete list of all equipment with status and location", icon: Package },
                { title: "Utilization Analytics", description: "Equipment usage patterns and optimization insights", icon: BarChart3 },
                { title: "Maintenance Schedule", description: "Upcoming and overdue maintenance activities", icon: Calendar },
              ]).map((qr, index) => {
                const IconComponent = qr.icon || [Package, BarChart3, Calendar][index];
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h3 className="font-medium">{qr.title}</h3>
                        {qr.description && <p className="text-xs text-muted-foreground">{qr.description}</p>}
                        {qr.lastGenerated && <p className="text-xs text-muted-foreground">Last generated: {qr.lastGenerated}</p>}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => handleGenerateReport(qr.title)}
                    >
                      <Download className="h-4 w-4" />
                      Generate
                    </Button>
                  </div>
                );
              })
            ) : (
              [
                { title: "My Requests", description: "View all your equipment requests", icon: FileText },
                { title: "My Department", description: "Equipment in your department", icon: Package },
                { title: "My Activity", description: "Your recent activities and usage", icon: BarChart3 },
              ].map((qr, index) => {
                const IconComponent = qr.icon || [FileText, Package, BarChart3][index];
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h3 className="font-medium">{qr.title}</h3>
                        {qr.description && <p className="text-xs text-muted-foreground">{qr.description}</p>}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => handleCustomReport(qr.title)}
                    >
                      <Download className="h-4 w-4" />
                      View
                    </Button>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
