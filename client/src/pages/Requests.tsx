// Requests.tsx

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  Plus,
  CheckCircle,
  Clock,
  AlertTriangle,
  Search,
  Package,
  User,
  Calendar,
  Filter,
  Edit
} from "lucide-react";
import { Link } from "react-router-dom";
import EditRequestDialog from "@/components/EditRequestDialog";

const email = localStorage.getItem('userEmail');

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

const addRequest = async (data: any) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`http://localhost:5000/api/requests?email=${email}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to add request");
  return res.json();
};

const updateRequest = async (data: any) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`http://localhost:5000/api/requests/${data.id}?email=${email}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to update request");
  return res.json();
};

const Requests = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [newRequest, setNewRequest] = useState({
    title: "",
    status: "pending",
    requested_by: "",
    department: "",
    urgency: "medium",
    created_date: new Date().toISOString().split('T')[0]
  });

  const { data: requests = [], isLoading, error } = useQuery({
    queryKey: ["requests"],
    queryFn: fetchRequests
  });

  const mutation = useMutation({
    mutationFn: addRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      setShowAddDialog(false);
      setNewRequest({
        title: "",
        status: "pending",
        requested_by: "",
        department: "",
        urgency: "medium",
        created_date: new Date().toISOString().split('T')[0]
      });
      toast({ title: "Success", description: "Request added successfully!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add request", variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: updateRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      setShowEditDialog(false);
      toast({ title: "Success", description: "Request updated successfully!" });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update request",
        variant: "destructive"
      });
    }
  });

  const filteredRequests = requests.filter(request => {
    const matchesSearch =
      request.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requested_by?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved': return CheckCircle;
      case 'pending': return Clock;
      case 'rejected': return AlertTriangle;
      case 'in-progress': return FileText;
      default: return FileText;
    }
  };

  const handleAddRequest = () => {
    if (!newRequest.title || !newRequest.requested_by || !newRequest.department) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    mutation.mutate(newRequest);
  };

  const handleSaveRequest = (updatedRequest: any) => {
    updateMutation.mutate(updatedRequest);
  };

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading requests</div>;

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Equipment Requests</h1>
        <p className="text-muted-foreground">Manage and track requests for your organization</p>
      </div>

      {/* Search + Filter + Dialog */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search requests..."
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
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit New Request</DialogTitle>
              <DialogDescription>Provide information for a new equipment request.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={newRequest.title}
                  onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
                  placeholder="Equipment title"
                />
              </div>
              <div>
                <Label>Requested By</Label>
                <Input
                  value={newRequest.requested_by}
                  onChange={(e) => setNewRequest({ ...newRequest, requested_by: e.target.value })}
                  placeholder="Your name"
                />
              </div>
              <div>
                <Label>Department</Label>
                <Input
                  value={newRequest.department}
                  onChange={(e) => setNewRequest({ ...newRequest, department: e.target.value })}
                  placeholder="Department"
                />
              </div>
              <div>
                <Label>Urgency</Label>
                <Select value={newRequest.urgency} onValueChange={(value) => setNewRequest({ ...newRequest, urgency: value })}>
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
              <div className="flex gap-2">
                <Button onClick={handleAddRequest} className="flex-1">Submit</Button>
                <Button variant="outline" onClick={() => setShowAddDialog(false)} className="flex-1">Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => {
          const StatusIcon = getStatusIcon(request.status);
          return (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <StatusIcon className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-foreground">{request.title}</h3>
                      <span className="text-sm text-muted-foreground">#ER-{request.id}</span>
                    </div>
                    {request.description && (
                      <p className="text-sm text-muted-foreground mb-2">{request.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {request.requested_by} • {request.department}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {request.created_date}
                      </div>
                    </div>
                    {/* Badge + Buttons Row */}
                    <div className="flex justify-between items-center mt-2">
                      {/* Badge bên trái */}
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(request.status)}>
                          {request.status.replace('-', ' ')}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(request.urgency)}>
                          {request.urgency}
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
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>{request.title}</DialogTitle>
                              <DialogDescription>Request ID: ER-{request.id}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Status</Label>
                                  <Badge className={getStatusColor(request.status)}>
                                    {request.status.replace('-', ' ')}
                                  </Badge>
                                </div>
                                <div>
                                  <Label>Urgency</Label>
                                  <Badge className={getStatusColor(request.urgency)}>
                                    {request.urgency}
                                  </Badge>
                                </div>
                                <div>
                                  <Label>Requested By</Label>
                                  <p className="text-sm font-medium">{request.requested_by}</p>
                                </div>
                                <div>
                                  <Label>Department</Label>
                                  <p className="text-sm font-medium">{request.department}</p>
                                </div>
                                <div>
                                  <Label>Date Submitted</Label>
                                  <p className="text-sm font-medium">{request.created_date}</p>
                                </div>
                              </div>
                              <div>
                                <Label>Description</Label>
                                <p className="text-sm mt-1">{request.description}</p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowEditDialog(true);
                          }}
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

      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No requests found matching your criteria.</p>
        </div>
      )}

      {/* Edit Request Dialog */}
      <EditRequestDialog
        request={selectedRequest}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSave={handleSaveRequest}
      />
    </main>
  );
};

export default Requests;
