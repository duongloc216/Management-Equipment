import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Wrench,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Settings,
  Search,
  Filter,
  Plus,
  Edit
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import EditMaintenanceDialog from "@/components/EditMaintenanceDialog";

const email = localStorage.getItem('userEmail');

const fetchMaintenance = async () => {
  const token = localStorage.getItem('token');
  const res = await fetch(`http://localhost:5000/api/maintenance?email=${email}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error("Failed to fetch maintenance");
  return res.json();
};

const updateMaintenance = async (updatedData: any) => {
  const token = localStorage.getItem('token');
  const res = await fetch(
    `http://localhost:5000/api/maintenance/${updatedData.id}?email=${email}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(updatedData),
    }
  );
  if (!res.ok) throw new Error("Failed to update maintenance");
  return res.json();
};

const addMaintenance = async (data) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`http://localhost:5000/api/maintenance?email=${email}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to add maintenance");
  return res.json();
};

const Maintenance = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [newMaintenance, setNewMaintenance] = useState({
    equipment: "",
    type: "",
    technician: "",
    priority: "medium",
    description: "",
    scheduledDate: ""
  });

  // Fetch dữ liệu thật từ backend
  const { data: maintenanceList = [], isLoading, error } = useQuery({
    queryKey: ["maintenance"],
    queryFn: fetchMaintenance,
  });

  const updateMutation = useMutation({
    mutationFn: updateMaintenance,
    onSuccess: () => {
      toast({
        title: "Updated",
        description: "Maintenance updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["maintenance"] });
      setShowEditDialog(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update maintenance",
        variant: "destructive",
      });
    },
  });

  const addMutation = useMutation({
    mutationFn: addMaintenance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance"] });
      setShowScheduleDialog(false);
      setNewMaintenance({
        equipment: "",
        type: "",
        technician: "",
        priority: "medium",
        description: "",
        scheduledDate: ""
      });
      toast({
        title: "Success",
        description: "Maintenance scheduled successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add maintenance",
        variant: "destructive",
      });
    }
  });

  // Tính toán stats từ dữ liệu thật
  const scheduledCount = maintenanceList.filter(m => m.status === 'scheduled').length;
  const completedCount = maintenanceList.filter(m => m.status === 'completed').length;
  const inProgressCount = maintenanceList.filter(m => m.status === 'in-progress').length;
  const overdueCount = maintenanceList.filter(m => m.status === 'overdue').length;

  const maintenanceStats = [
    {
      title: "Scheduled This Month",
      value: scheduledCount,
      change: "",
      icon: Calendar,
      color: "text-blue-600"
    },
    {
      title: "Completed",
      value: completedCount,
      change: "",
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      title: "In Progress",
      value: inProgressCount,
      change: "",
      icon: Settings,
      color: "text-orange-600"
    },
    {
      title: "Overdue",
      value: overdueCount,
      change: "",
      icon: AlertTriangle,
      color: "text-red-600"
    }
  ];

  const filteredMaintenance = maintenanceList.filter(maintenance => {
    const matchesSearch = (maintenance.equipment?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                         (maintenance.type?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                         (String(maintenance.id || "").toLowerCase()).includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || maintenance.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleScheduleMaintenance = () => {
    if (!newMaintenance.equipment || !newMaintenance.type || !newMaintenance.technician || !newMaintenance.scheduledDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    addMutation.mutate({
      equipment: newMaintenance.equipment,
      type: newMaintenance.type,
      status: "scheduled",
      scheduled_date: newMaintenance.scheduledDate,
      technician: newMaintenance.technician,
      priority: newMaintenance.priority,
      estimated_duration: "",
      description: newMaintenance.description
    });
  };

  const handleEditMaintenance = (maintenance) => {
    setSelectedMaintenance(maintenance);
    setShowEditDialog(true);
  };

  const handleSaveMaintenance = (updatedMaintenance) => {
    updateMutation.mutate(updatedMaintenance);
  };

  const handleStatClick = (statTitle: string) => {
    let filterValue = "all";
    switch (statTitle) {
      case "Scheduled This Month":
        filterValue = "scheduled";
        break;
      case "Completed":
        filterValue = "completed";
        break;
      case "In Progress":
        filterValue = "in-progress";
        break;
      case "Overdue":
        filterValue = "overdue";
        break;
    }
    setStatusFilter(filterValue);
    toast({
      title: "Filter Applied",
      description: `Showing ${statTitle.toLowerCase()} maintenance tasks`,
    });
  };

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">Error loading maintenance tasks</div>;

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Maintenance Management</h1>
        <p className="text-muted-foreground">Schedule and track equipment maintenance activities</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {maintenanceStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleStatClick(stat.title)}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <IconComponent className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search maintenance tasks..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
        <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Schedule Maintenance
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Maintenance</DialogTitle>
              <DialogDescription>
                Schedule a new maintenance task for equipment.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="equipment">Equipment</Label>
                <Input
                  id="equipment"
                  value={newMaintenance.equipment}
                  onChange={(e) => setNewMaintenance({...newMaintenance, equipment: e.target.value})}
                  placeholder="Enter equipment name/ID"
                />
              </div>
              <div>
                <Label htmlFor="type">Maintenance Type</Label>
                <Select value={newMaintenance.type} onValueChange={(value) => setNewMaintenance({...newMaintenance, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select maintenance type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Routine Cleaning">Routine Cleaning</SelectItem>
                    <SelectItem value="Hardware Check">Hardware Check</SelectItem>
                    <SelectItem value="Software Update">Software Update</SelectItem>
                    <SelectItem value="Repair">Repair</SelectItem>
                    <SelectItem value="Replacement">Replacement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="technician">Technician</Label>
                <Input
                  id="technician"
                  value={newMaintenance.technician}
                  onChange={(e) => setNewMaintenance({...newMaintenance, technician: e.target.value})}
                  placeholder="Assign technician"
                />
              </div>
              <div>
                <Label htmlFor="scheduledDate">Scheduled Date</Label>
                <Input
                  id="scheduledDate"
                  type="date"
                  value={newMaintenance.scheduledDate}
                  onChange={(e) => setNewMaintenance({...newMaintenance, scheduledDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={newMaintenance.priority} onValueChange={(value) => setNewMaintenance({...newMaintenance, priority: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newMaintenance.description}
                  onChange={(e) => setNewMaintenance({...newMaintenance, description: e.target.value})}
                  placeholder="Describe the maintenance task"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleScheduleMaintenance} className="flex-1">Schedule</Button>
                <Button variant="outline" onClick={() => setShowScheduleDialog(false)} className="flex-1">Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Maintenance List */}
      <div className="space-y-4">
        {filteredMaintenance.map((maintenance) => {
          return (
            <Card key={maintenance.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Wrench className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-foreground">{maintenance.type}</h3>
                      <span className="text-sm text-muted-foreground">#{maintenance.id}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{maintenance.equipment}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {maintenance.scheduledDate}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {maintenance.estimatedDuration}
                      </div>
                      <span>Technician: {maintenance.technician}</span>
                    </div>
                    {/* Badge + Buttons Row */}
                    <div className="flex justify-between items-center mt-2">
                      {/* Badge bên trái */}
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(maintenance.status)}>
                          {maintenance.status.replace('-', ' ')}
                        </Badge>
                        <Badge variant="outline" className={getPriorityColor(maintenance.priority)}>
                          {maintenance.priority}
                        </Badge>
                      </div>
                      {/* Nút bên phải */}
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{maintenance.type}</DialogTitle>
                              <DialogDescription>Maintenance ID: {maintenance.id}</DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Equipment</Label>
                                <p className="text-sm font-medium">{maintenance.equipment}</p>
                              </div>
                              <div>
                                <Label>Status</Label>
                                <Badge className={getStatusColor(maintenance.status)}>
                                  {maintenance.status.replace('-', ' ')}
                                </Badge>
                              </div>
                              <div>
                                <Label>Scheduled Date</Label>
                                <p className="text-sm font-medium">{maintenance.scheduledDate}</p>
                              </div>
                              <div>
                                <Label>Priority</Label>
                                <Badge className={getPriorityColor(maintenance.priority)}>
                                  {maintenance.priority}
                                </Badge>
                              </div>
                              <div>
                                <Label>Technician</Label>
                                <p className="text-sm font-medium">{maintenance.technician}</p>
                              </div>
                              <div>
                                <Label>Duration</Label>
                                <p className="text-sm font-medium">{maintenance.estimatedDuration}</p>
                              </div>
                            </div>
                            <div>
                              <Label>Description</Label>
                              <p className="text-sm mt-1">{maintenance.description}</p>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditMaintenance(maintenance)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredMaintenance.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No maintenance tasks found matching your criteria.</p>
        </div>
      )}

      {/* Edit Maintenance Dialog */}
      <EditMaintenanceDialog
        maintenance={selectedMaintenance}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSave={handleSaveMaintenance}
      />
    </main>
  );
};

export default Maintenance;