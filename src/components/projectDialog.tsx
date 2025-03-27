"use client";

import { PlusCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProjectDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleSubmit: (e: React.FormEvent) => void;
  editingId: number | null;
  setEditingId: (id: number | null) => void;
  projectId: string;
  setProjectId: (id: string) => void;
  webhookLark: string;
  setWebhookLark: (url: string) => void;
  isLoading: boolean;
  projectIdError: string;
  webhookLarkError: string;
}

const ProjectDialog: React.FC<ProjectDialogProps> = ({
  open,
  setOpen,
  handleSubmit,
  editingId,
  setEditingId,
  projectId,
  setProjectId,
  webhookLark,
  setWebhookLark,
  isLoading,
  projectIdError,
  webhookLarkError,
}) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          setEditingId(null);
          setProjectId("");
          setWebhookLark("");
        }
        setOpen(newOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Project" : "Add New Project"}
            </DialogTitle>
            <DialogDescription>
              Enter the project ID and webhook URL for Lark.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="projectId" className="text-left">
                Project ID
              </Label>
              <Input
                id="projectId"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="col-span-3"
                placeholder="project-123"
              />
              {projectIdError && (
                <p className="text-red-500 text-sm col-span-4">
                  {projectIdError}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="webhookLark" className="text-left">
                Webhook Lark
              </Label>
              <Input
                id="webhookLark"
                value={webhookLark}
                onChange={(e) => setWebhookLark(e.target.value)}
                className="col-span-3"
                placeholder="https://open.larksuite.com/webhook/v1/..."
              />
              {webhookLarkError && (
                <p className="text-red-500 text-sm col-span-4">
                  {webhookLarkError}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Saving...
                </>
              ) : editingId ? (
                "Update"
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDialog;
