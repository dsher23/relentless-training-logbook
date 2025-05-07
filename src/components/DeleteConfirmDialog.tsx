
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

/**
 * Generic delete confirmation dialog.
 * @param {boolean} open - Dialog open state.
 * @param {(open: boolean) => void} onOpenChange - Dialog open change handler.
 * @param {() => void} onConfirm - Confirm (delete) action.
 * @param {() => void} onCancel - Cancel action.
 * @param {string} title - Dialog title.
 * @param {string} message - Dialog message/body.
 * @param {string} confirmLabel - Confirm button label.
 * @param {string} cancelLabel - Cancel button label.
 * @param {"destructive" | "default"} [variant] - Confirm button variant.
 */
interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "destructive" | "default";
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  title,
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  variant = "destructive",
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <div className="mb-4">{message}</div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>{cancelLabel}</Button>
        <Button variant={variant} onClick={onConfirm}>{confirmLabel}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default DeleteConfirmDialog;
