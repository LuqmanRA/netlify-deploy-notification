"use client";

import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CopyButton } from "./copyButton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Project {
  id: number;
  project_id: string;
  webhook_lark: string;
  total_deploy: string;
  success_count: string;
  failed_count: string;
}

interface ProjectTableProps {
  projects: Project[];
  handleEdit: (project: Project) => void;
  deleteProject: (id: number) => void;
}

const ProjectTable: React.FC<ProjectTableProps> = ({
  projects,
  handleEdit,
  deleteProject,
}) => {
  return (
    <>
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
                  <CopyButton
                    variant="ghost"
                    size="sm"
                    value={webhook.project_id}
                    className="cursor-pointer"
                  />
                  <Button
                    onClick={() => handleEdit(webhook)}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 cursor-pointer"
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer">
                      <Trash2 className="h-4 w-4" />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your account and remove your data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="cursor-pointer"
                          onClick={() => deleteProject(webhook.id)}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default ProjectTable;
