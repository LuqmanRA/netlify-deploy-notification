"use client";

import { useEffect, useState } from "react";
import ProjectTable from "@/components/projectTable";
import ProjectDialog from "@/components/projectDialog";
import { toast } from "sonner";
import ProjectPagination from "@/components/projectPagination";

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
  const [projectIdError, setProjectIdError] = useState("");
  const [webhookLarkError, setWebhookLarkError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data);
  }

  useEffect(() => {
    if (!open) {
      setProjectIdError("");
      setWebhookLarkError("");
    }
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setProjectIdError("");
    setWebhookLarkError("");

    const payload = editingId
      ? { id: editingId, projectId, webhookLark }
      : { projectId, webhookLark };

    const method = editingId ? "PUT" : "POST";

    const res = await fetch("/api/projects", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      if (data.errors) {
        setProjectIdError(data.errors.projectId || "");
        setWebhookLarkError(data.errors.webhookLark || "");
      }
      setIsLoading(false);
      return;
    }

    await fetchProjects();
    if (editingId) {
      toast.success("Update successful!");
    } else {
      toast.success("Create successful!");
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
      toast.success("Delete successful!");
    }
  }

  const totalPages = Math.ceil(projects.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = projects.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <section className={`w-full min-h-screen `}>
      <div className="container mx-auto py-10 px-4 md:px-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Project Netlify</h1>
          <ProjectDialog
            open={open}
            setOpen={setOpen}
            handleSubmit={handleSubmit}
            editingId={editingId}
            setEditingId={setEditingId}
            projectId={projectId}
            setProjectId={setProjectId}
            webhookLark={webhookLark}
            setWebhookLark={setWebhookLark}
            isLoading={isLoading}
            projectIdError={projectIdError}
            webhookLarkError={webhookLarkError}
          />
        </div>

        <div className="w-full mx-auto space-y-4">
          <div className="rounded-md border">
            <ProjectTable
              projects={currentItems}
              handleEdit={handleEdit}
              deleteProject={deleteProject}
            />
          </div>
          <ProjectPagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
          />
        </div>
      </div>
    </section>
  );
}
