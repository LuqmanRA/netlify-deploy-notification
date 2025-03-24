"use client";

import { useEffect, useState } from "react";
import { PlusCircle, Edit, Trash2, Loader2 } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Project {
  id: number;
  project_id: string;
  webhook_lark: string;
  total_deploy: string;
  success_count: string;
  failed_count: string;
}

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [webhookLark, setWebhookLark] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    const payload = editingId
      ? { id: editingId, projectId, webhookLark }
      : { projectId, webhookLark };

    const method = editingId ? "PUT" : "POST";

    const res = await fetch("/api/projects", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      await fetchProjects();
    }

    setIsLoading(false);
    setEditingId(null);
    setProjectId("");
    setWebhookLark("");
    setOpen(false);
  }

  const handleEdit = (webhook: Project) => {
    setEditingId(webhook.id);
    setProjectId(webhook.project_id);
    setWebhookLark(webhook.webhook_lark);
    setOpen(true);
  };

  async function deleteProject(id: number) {
    const res = await fetch("/api/projects", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      await fetchProjects();
    }
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Project Netlify</h1>
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
                    required
                  />
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
                    required
                  />
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
      </div>

      <div className="rounded-md border">
        <Table>
          <TableCaption>List of Projects Netlify</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">No.</TableHead>
              <TableHead>Project ID</TableHead>
              <TableHead>Webhook Lark</TableHead>
              <TableHead>Deploy</TableHead>
              <TableHead>Success</TableHead>
              <TableHead>Failed</TableHead>
              <TableHead className="w-[100px] text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((webhook, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{webhook.project_id}</TableCell>
                <TableCell className="font-mono text-sm">
                  {webhook.webhook_lark}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {webhook.total_deploy}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {webhook.success_count}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {webhook.failed_count}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-center gap-2">
                    <Button
                      onClick={() => handleEdit(webhook)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 cursor-pointer"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteProject(webhook.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
