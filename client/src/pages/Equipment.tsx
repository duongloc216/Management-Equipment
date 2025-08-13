import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Package, Search, Filter, Plus,
  Monitor, Laptop, Smartphone, Printer,
  CheckCircle, Clock, AlertTriangle, Wrench, Edit
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import ProfileDropdown from "@/components/ProfileDropdown";
import EditEquipmentDialog from "@/components/EditEquipmentDialog";

// API
const fetchEquipment = async () => {
  const email = localStorage.getItem('userEmail');
  const token = localStorage.getItem('token');
  const res = await fetch(`http://localhost:5000/api/devices?email=${email}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error("Failed to fetch equipment");
  return res.json();
};

const addEquipment = async (data) => {
  const email = localStorage.getItem('userEmail');
  const token = localStorage.getItem('token');
  const res = await fetch(`http://localhost:5000/api/devices?email=${email}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to add equipment");
  return res.json();
};

const updateEquipment = async (data) => {
  const email = localStorage.getItem('userEmail');
  const token = localStorage.getItem('token');
  const res = await fetch(`http://localhost:5000/api/devices/${data.id}?email=${email}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to update equipment");
  return res.json();
};

const deleteEquipment = async (id) => {
  const email = localStorage.getItem('userEmail');
  const token = localStorage.getItem('token');
  const res = await fetch(`http://localhost:5000/api/devices/${id}?email=${email}`, {
    method: "DELETE",
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Failed to delete equipment");
  return res.json();
};

const Equipment = () => {
  const { logout, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [newEquipment, setNewEquipment] = useState({
    name: "",
    type: "",
    status: "Available",
    department: "",
    assigned_to: "",
    condition: "excellent",
    purchase_date: "",
    maintenance_due: ""
  });

  const { data: equipmentList = [], isLoading, error } = useQuery({
    queryKey: ["equipment"],
    queryFn: fetchEquipment
  });

  const addMutation = useMutation({
    mutationFn: addEquipment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
      setNewEquipment({
        name: "",
        type: "",
        status: "Available",
        department: "",
        assigned_to: "",
        condition: "excellent",
        purchase_date: "",
        maintenance_due: ""
      });
      setShowAddDialog(false);
      toast({ title: "Success", description: "Equipment added successfully!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add equipment", variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: updateEquipment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
      toast({ title: "Updated", description: "Equipment updated successfully!" });
      setShowEditDialog(false);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEquipment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
      toast({ title: "Deleted", description: "Equipment deleted successfully!" });
      setShowEditDialog(false);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    }
  });

  const filteredEquipment = equipmentList.filter((item) => {
    const matchesSearch = (item.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                         (String(item.id || '').toLowerCase()).includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'in use': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      case 'retired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'available': return CheckCircle;
      case 'in use': return Clock;
      case 'maintenance': return Wrench;
      case 'retired': return AlertTriangle;
      default: return Package;
    }
  };

  const getEquipmentIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'laptop': return Laptop;
      case 'monitor': return Monitor;
      case 'mobile': return Smartphone;
      case 'printer': return Printer;
      default: return Package;
    }
  };

  const handleAdd = () => {
    if (!newEquipment.name || !newEquipment.assigned_to || !newEquipment.department || !newEquipment.purchase_date || !newEquipment.maintenance_due) {
      toast({ title: "Missing Fields", description: "Please fill in required fields", variant: "destructive" });
      return;
    }
    addMutation.mutate({
      name: newEquipment.name,
      assigned_to: newEquipment.assigned_to,
      status: newEquipment.status,
      department: newEquipment.department,
      purchase_date: newEquipment.purchase_date,
      maintenance_due: newEquipment.maintenance_due,
      userEmail: user?.email
    });
  };

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">Failed to load data</div>;

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Equipment Management</h1>
        <p className="text-muted-foreground">Manage and track your organizational equipment in one place</p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search equipment..."
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
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="in use">In Use</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="retired">Retired</SelectItem>
          </SelectContent>
        </Select>

        {/* Add Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Equipment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Equipment</DialogTitle>
              <DialogDescription>Fill in information below</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Name</Label>
                <Input value={newEquipment.name} onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })} />
              </div>
              <div>
                <Label>Assigned To</Label>
                <Input value={newEquipment.assigned_to} onChange={(e) => setNewEquipment({ ...newEquipment, assigned_to: e.target.value })} />
              </div>
              <div>
                <Label>Department</Label>
                <Input value={newEquipment.department} onChange={(e) => setNewEquipment({ ...newEquipment, department: e.target.value })} />
              </div>
              <div>
                <Label>Purchase Date</Label>
                <Input
                  type="date"
                  value={newEquipment.purchase_date}
                  onChange={(e) => setNewEquipment({ ...newEquipment, purchase_date: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Maintenance Due</Label>
                <Input
                  type="date"
                  value={newEquipment.maintenance_due}
                  onChange={(e) => setNewEquipment({ ...newEquipment, maintenance_due: e.target.value })}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={handleAdd}>Add</Button>
                <Button variant="outline" className="flex-1" onClick={() => setShowAddDialog(false)}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map((equipment) => {
          const StatusIcon = getStatusIcon(equipment.status);
          const EquipmentIcon = getEquipmentIcon(equipment.type);

          return (
            <Card key={equipment.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <EquipmentIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{equipment.name}</CardTitle>
                      <CardDescription>{equipment.id} • {equipment.type}</CardDescription>
                    </div>
                  </div>
                  <StatusIcon className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge className={getStatusColor(equipment.status)}>{equipment.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Department</span>
                    <span className="text-sm font-medium">{equipment.department || "-"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Assigned To</span>
                    <span className="text-sm font-medium">{equipment.assigned_to || "-"}</span>
                  </div>
                  <div className="pt-3 border-t flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setSelectedEquipment(equipment);
                        setShowEditDialog(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit / Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredEquipment.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No equipment found matching your criteria.</p>
        </div>
      )}

      <EditEquipmentDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        equipment={selectedEquipment}
        onSave={(data) => updateMutation.mutate(data)}
        onDelete={(id) => deleteMutation.mutate(id)}
      />
    </main>
  );
};

export default Equipment;
