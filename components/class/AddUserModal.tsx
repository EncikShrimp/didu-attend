"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  onAddUser: (userData: { name: string; email: string; note?: string }) => void;
}

/**
 * A modal that lets you add a user with Name, Email, and optional Note.
 * onAddUser is called when the user clicks "Add".
 */
export function AddUserModal({ open, onClose, onAddUser }: AddUserModalProps) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [note, setNote] = React.useState("");

  // Clear form when the modal opens
  React.useEffect(() => {
    if (open) {
      setName("");
      setEmail("");
      setNote("");
    }
  }, [open]);

  function handleSubmit() {
    // You might do some validation here
    if (!name.trim() || !email.trim()) {
      alert("Name and Email are required.");
      return;
    }
    onAddUser({ name, email, note });
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label htmlFor="userName">Name</Label>
            <Input
              id="userName"
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="userEmail">Email</Label>
            <Input
              id="userEmail"
              placeholder="e.g. john@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="userNote">Note (optional)</Label>
            <Textarea
              id="userNote"
              placeholder="Any extra notes about this user"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
