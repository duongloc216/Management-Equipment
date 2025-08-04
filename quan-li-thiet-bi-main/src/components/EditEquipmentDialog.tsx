import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface EditEquipmentDialogProps {
  equipment: {
    id: string;
    name: string;
    type: string;
    status: string;
    department: string;
    assigned_to: string;
    condition: string;
    purchase_date: string;
    maintenance_due: string;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedEquipment: any) => void;
  onDelete: (equipmentId: string) => void;
}

const EditEquipmentDialog = ({ equipment, open, onOpenChange, onSave, onDelete }: EditEquipmentDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: equipment?.name || '',
    type: equipment?.type || '',
    status: equipment?.status || '',
    department: equipment?.department || '',
    assigned_to: equipment?.assigned_to || '',
    condition: equipment?.condition || '',
    purchase_date: equipment?.purchase_date || '',
    maintenance_due: equipment?.maintenance_due || ''
  });

  // Update form data when equipment changes
  useEffect(() => {
    if (equipment) {
      setFormData({
        name: equipment.name || '',
        type: equipment.type || '',
        status: equipment.status || '',
        department: equipment.department || '',
        assigned_to: equipment.assigned_to || '',
        condition: equipment.condition || '',
        purchase_date: equipment.purchase_date || '',
        maintenance_due: equipment.maintenance_due || ''
      });
    }
  }, [equipment]);

  const handleSave = () => {
    if (!equipment) return;
    
    onSave({
      ...equipment,
      ...formData
    });
    toast({
      title: "Equipment Updated",
      description: "Equipment information has been updated successfully",
    });
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (equipment) {
      onDelete(equipment.id);
      toast({
        title: "Equipment Deleted",
        description: "Equipment has been deleted successfully",
        variant: "destructive",
      });
      onOpenChange(false);
    }
  };

  if (!equipment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Equipment</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Equipment Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="In Use">In Use</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Retired">Retired</SelectItem>
              </SelectContent>
            </Select>
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
            <Label htmlFor="assigned_to">Assigned To</Label>
            <Input
              id="assigned_to"
              value={formData.assigned_to}
              onChange={(e) => setFormData(prev => ({ ...prev, assigned_to: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="purchase_date">Purchase Date</Label>
            <Input
              id="purchase_date"
              type="date"
              value={formData.purchase_date}
              onChange={(e) => setFormData(prev => ({ ...prev, purchase_date: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="maintenance_due">Maintenance Due</Label>
            <Input
              id="maintenance_due"
              type="date"
              value={formData.maintenance_due}
              onChange={(e) => setFormData(prev => ({ ...prev, maintenance_due: e.target.value }))}
            />
          </div>

          <div className="pt-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  Delete Equipment
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the equipment.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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

export default EditEquipmentDialog;