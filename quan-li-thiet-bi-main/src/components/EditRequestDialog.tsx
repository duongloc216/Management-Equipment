import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface EditRequestDialogProps {
  request: {
    id: string;
    title: string;
    status: string;
    requested_by: string;
    department: string;
    created_date: string;
    urgency: string;
    description: string;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedRequest: any) => void;
}

const EditRequestDialog = ({ request, open, onOpenChange, onSave }: EditRequestDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: request?.title || '',
    status: request?.status || '',
    requested_by: request?.requested_by || '',
    department: request?.department || '',
    urgency: request?.urgency || 'medium',
    description: request?.description || ''
  });

  // Update form data when request changes
  useEffect(() => {
    if (request) {
      setFormData({
        title: request.title || '',
        status: request.status || '',
        requested_by: request.requested_by || '',
        department: request.department || '',
        urgency: request.urgency || 'medium',
        description: request.description || ''
      });
    }
  }, [request]);

  const handleSave = () => {
    if (!request) return;
    
    onSave({
      ...request,
      ...formData
    });
    toast({
      title: "Request Updated",
      description: "Request has been updated successfully",
    });
    onOpenChange(false);
  };

  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Request</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Equipment Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="requested_by">Requested By</Label>
            <Input
              id="requested_by"
              value={formData.requested_by}
              onChange={(e) => setFormData(prev => ({ ...prev, requested_by: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="urgency">Urgency</Label>
            <Select value={formData.urgency} onValueChange={(value) => setFormData(prev => ({ ...prev, urgency: value }))}>
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
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              placeholder="Enter request description..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditRequestDialog;