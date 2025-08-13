import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface EditMaintenanceDialogProps {
  maintenance: {
    id: string;
    equipment: string;
    type: string;
    scheduledDate: string;
    status: string;
    technician: string;
    priority: string;
    description: string;
    estimatedDuration: string;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedMaintenance: any) => void;
}

const EditMaintenanceDialog = ({ maintenance, open, onOpenChange, onSave }: EditMaintenanceDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    equipment: maintenance?.equipment || '',
    type: maintenance?.type || '',
    scheduledDate: maintenance?.scheduledDate || '',
    status: maintenance?.status || '',
    technician: maintenance?.technician || '',
    priority: maintenance?.priority || 'medium',
    description: maintenance?.description || '',
    estimatedDuration: maintenance?.estimatedDuration || '',
    completedDate: new Date().toISOString().split('T')[0],
    maintenanceResult: ''
  });

  // Update form data when maintenance changes
  useEffect(() => {
    if (maintenance) {
      setFormData({
        equipment: maintenance.equipment || '',
        type: maintenance.type || '',
        scheduledDate: maintenance.scheduledDate || '',
        status: maintenance.status || '',
        technician: maintenance.technician || '',
        priority: maintenance.priority || 'medium',
        description: maintenance.description || '',
        estimatedDuration: maintenance.estimatedDuration || '',
        completedDate: new Date().toISOString().split('T')[0],
        maintenanceResult: ''
      });
    }
  }, [maintenance]);

  const handleSave = () => {
    if (!maintenance) return;
    
    onSave({
      ...maintenance,
      ...formData
    });
    toast({
      title: "Maintenance Updated",
      description: "Maintenance record has been updated successfully",
    });
    onOpenChange(false);
  };

  if (!maintenance) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Maintenance</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="equipment">Equipment</Label>
            <Input
              id="equipment"
              value={formData.equipment}
              onChange={(e) => setFormData(prev => ({ ...prev, equipment: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="type">Maintenance Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
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
            <Label htmlFor="scheduledDate">Scheduled Date</Label>
            <Input
              type="date"
              id="scheduledDate"
              value={formData.scheduledDate}
              onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="technician">Technician</Label>
            <Input
              id="technician"
              value={formData.technician}
              onChange={(e) => setFormData(prev => ({ ...prev, technician: e.target.value }))}
              placeholder="Enter technician name"
            />
          </div>

          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
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
            <Label htmlFor="estimatedDuration">Estimated Duration</Label>
            <Input
              id="estimatedDuration"
              value={formData.estimatedDuration}
              onChange={(e) => setFormData(prev => ({ ...prev, estimatedDuration: e.target.value }))}
              placeholder="e.g., 2 hours"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
            />
          </div>

          {formData.status === 'completed' && (
            <>
              <div>
                <Label htmlFor="completedDate">Completed Date</Label>
                <Input
                  type="date"
                  id="completedDate"
                  value={formData.completedDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, completedDate: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="maintenanceResult">Maintenance Result</Label>
                <Textarea
                  id="maintenanceResult"
                  value={formData.maintenanceResult}
                  onChange={(e) => setFormData(prev => ({ ...prev, maintenanceResult: e.target.value }))}
                  placeholder="Enter maintenance results and findings"
                  rows={3}
                />
              </div>
            </>
          )}
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

export default EditMaintenanceDialog;