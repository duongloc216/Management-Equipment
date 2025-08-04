import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Users, 
  Settings, 
  Shield, 
  Activity,
  AlertTriangle,
  UserCheck,
  Database,
  BarChart3,
  UserPlus,
  Eye
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import ProfileDropdown from "@/components/ProfileDropdown";
import UserDetailDialog from "@/components/UserDetailDialog";
import EditUserDialog from "@/components/EditUserDialog";
import AddUserDialog from "@/components/AddUserDialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const Admin = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const email = localStorage.getItem('userEmail');
  if (!email) {
    window.location.href = '/login';
    return null;
  }

  // Fetch admin stats
  const fetchUserStatsOverview = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/users/stats/overview', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error('Failed to fetch user stats');
    return res.json();
  };
  // Fetch user list
  const fetchUserList = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:5000/api/users?email=${email}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error("Failed to fetch users");
    return res.json();
  };
  // Fetch system logs
  const fetchSystemLogs = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:5000/api/reports/logs?email=${email}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error("Failed to fetch logs");
    return res.json();
  };

  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetailOpen, setUserDetailOpen] = useState(false);
  const [userEditOpen, setUserEditOpen] = useState(false);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [showAllLogs, setShowAllLogs] = useState(false);

  const handleUserAction = (action: string, userEmail: string) => {
    toast({
      title: "Admin Action",
      description: `${action} for user: ${userEmail}`,
    });
  };

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setUserDetailOpen(true);
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setUserEditOpen(true);
  };

  const handleSaveUser = (updatedUser: any) => {
    // Implementation needed
  };

  const handleDeleteUser = (userEmail: string) => {
    // Implementation needed
  };

  const addUserMutation = useMutation({
    mutationFn: async (newUser: any) => {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/users?email=${email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(newUser),
      });
      if (!res.ok) {
        let errorMsg = "Failed to add user";
        try {
          const error = await res.json();
          errorMsg = error.message || errorMsg;
        } catch {}
        throw new Error(errorMsg);
      }
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "User Added",
        description: "New user has been added successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["userList"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add user",
        variant: "destructive",
      });
    },
  });

  const handleAddUser = (newUser: any) => {
    addUserMutation.mutate(newUser);
  };

  const handleSystemAction = (action: string) => {
    toast({
      title: "System Action",
      description: `${action} executed successfully`,
    });
  };

  // Fetch dữ liệu thật
  const { data: stats, isLoading: loadingStats, error: errorStats } = useQuery({
    queryKey: ["adminStats"],
    queryFn: fetchUserStatsOverview,
  });
  const { data: userList = [], isLoading: loadingUsers, error: errorUsers } = useQuery({
    queryKey: ["userList"],
    queryFn: fetchUserList,
  });
  const { data: systemLogs = [], isLoading: loadingLogs, error: errorLogs } = useQuery({
    queryKey: ["systemLogs"],
    queryFn: fetchSystemLogs,
  });

  const displayedUsers = showAllUsers ? userList : userList.slice(0, 4);
  const displayedLogs = showAllLogs ? systemLogs : systemLogs.slice(0, 4);

  // Xây dựng lại adminStats từ dữ liệu thật
  const adminStats = stats
    ? [
        {
          title: "Total Users",
          value: stats.totalUsers,
          change: stats.totalUsersChange || "",
          icon: Users,
          color: "text-blue-600",
        },
        {
          title: "Active Sessions",
          value: stats.activeSessions,
          change: stats.activeSessionsChange || "",
          icon: Activity,
          color: "text-green-600",
        },
        {
          title: "System Alerts",
          value: stats.systemAlerts,
          change: stats.systemAlertsChange || "",
          icon: AlertTriangle,
          color: "text-red-600",
        },
      ]
    : [];

  // Loading/error UI
  if (loadingStats || loadingUsers || loadingLogs)
    return <div className="p-6">Loading...</div>;
  if (errorStats || errorUsers || errorLogs)
    return <div className="p-6 text-red-600">Error loading admin data</div>;

  return (
    <div className="min-h-screen bg-background">
      {/* Header và Navigation */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-primary" />
              <Link to="/dashboard" className="text-2xl font-bold text-foreground hover:text-primary transition-colors">
                Admin Panel
              </Link>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
              <Link to="/equipment" className="text-muted-foreground hover:text-foreground transition-colors">Equipment</Link>
              <Link to="/requests" className="text-muted-foreground hover:text-foreground transition-colors">Requests</Link>
              <Link to="/maintenance" className="text-muted-foreground hover:text-foreground transition-colors">Maintenance</Link>
              <Link to="/reports" className="text-muted-foreground hover:text-foreground transition-colors">Reports</Link>
              <Link to="/admin" className="text-primary font-medium">Admin</Link>
              <ProfileDropdown />
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground mb-8">Welcome back, {user?.name}. Manage your system here.</p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {adminStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <IconComponent className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <BarChart3 className="h-3 w-3 mr-1 text-green-600" />
                    {stat.change} from last week
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* User Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> User Management</CardTitle>
                  <CardDescription>Manage user accounts and permissions</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setAddUserOpen(true)}><UserPlus className="h-4 w-4 mr-2" /> Add User</Button>
                  <Button variant="outline" size="sm" onClick={() => setShowAllUsers(!showAllUsers)}><Eye className="h-4 w-4 mr-2" />{showAllUsers ? 'Show Less' : 'View All'}</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {displayedUsers.map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <UserCheck className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>{user.role}</Badge>
                          <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>{user.status}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewUser(user)}>View</Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Logs */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5" /> System Activity</CardTitle>
                  <CardDescription>Recent system logs and activities</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowAllLogs(!showAllLogs)}><Eye className="h-4 w-4 mr-2" />{showAllLogs ? 'Show Less' : 'View All'}</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {displayedLogs.map((log, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{log.action}</p>
                      <p className="text-sm text-muted-foreground">{log.user} • {log.time}</p>
                    </div>
                    <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>{log.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Controls */}
        {/* ĐÃ XÓA toàn bộ Card System Controls ở đây */}
      </main>

      {/* User Dialogs */}
      <UserDetailDialog user={selectedUser} open={userDetailOpen} onOpenChange={setUserDetailOpen} />
      <EditUserDialog user={selectedUser} open={userEditOpen} onOpenChange={setUserEditOpen} onSave={handleSaveUser} onDelete={handleDeleteUser} />
      <AddUserDialog open={addUserOpen} onOpenChange={setAddUserOpen} onAddUser={handleAddUser} />
    </div>
  );
};

export default Admin;
