"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import api from "@/lib/api";

export default function EngineerDashboard() {
  const queryClient = useQueryClient();

  const { data: projects, isLoading } = useQuery({
    queryKey: ["engineer-projects"],
    queryFn: async () => {
      try {
        const { data } = await api.get("/projects");
        return data;
      } catch (e) {
        return [];
      }
    }
  });

  const { data: comments, isLoading: isCommentsLoading } = useQuery({
    queryKey: ["manager-comments"],
    queryFn: async () => {
      try {
        const { data } = await api.get("/projectcomments");
        return data;
      } catch (e) { return []; }
    }
  });

  const resolveMutation = useMutation({
    mutationFn: async ({ id, isRejected }: { id: string, isRejected: boolean }) =>
      await api.post(`/projectcomments/${id}/resolve`, { isRejected, adminRemarks: "Action taken by engineer." }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["manager-comments"] })
  });

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Engineer Workspace</h1>
          <p className="text-muted-foreground mt-1">Manage project technical data, maps, and resolve feedback.</p>
        </div>

        <Card className="border-yellow-500/50 shadow-sm">
          <CardHeader>
            <CardTitle>Pending Manager Feedback</CardTitle>
            <CardDescription>Review and resolve structural/safety comments.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                {isCommentsLoading ? (
                  <div className="flex justify-center p-6"><Loader2 className="animate-spin text-muted-foreground" /></div>
                ) : comments?.filter((c: any) => !c.isResolved && !c.isRejected).length === 0 ? (
                  <p className="text-muted-foreground text-sm">All caught up! No pending feedback.</p>
                ) : comments?.filter((c: any) => !c.isResolved && !c.isRejected).map((comment: any) => (
                  <div key={comment.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div>
                      <p className="font-medium text-sm">{comment.text}</p>
                      <p className="text-xs text-muted-foreground">Project: {comment.projectName}</p>
                    </div>
                    <div className="flex gap-2">
                       <Button size="sm" variant="outline" className="text-emerald-600" onClick={() => resolveMutation.mutate({ id: comment.id, isRejected: false })}>
                         <CheckCircle className="h-4 w-4 mr-1"/> Resolve
                       </Button>
                       <Button size="sm" variant="outline" className="text-destructive" onClick={() => resolveMutation.mutate({ id: comment.id, isRejected: true })}>
                         <XCircle className="h-4 w-4 mr-1"/> Reject
                       </Button>
                    </div>
                  </div>
                ))}
             </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Technical Project Overview</CardTitle>
            <CardDescription>Live data synced from the ASP.NET backend.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Contractor</TableHead>
                  <TableHead>Coordinates</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={6} className="text-center h-24"><Loader2 className="animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow>
                ) : projects?.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center h-24 text-muted-foreground">No projects found. Create one from the Superuser dashboard.</TableCell></TableRow>
                ) : projects?.map((p: any) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium text-xs text-muted-foreground">{p.id.substring(0,8)}</TableCell>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.contractor || "TBD"}</TableCell>
                    <TableCell className="text-xs font-mono">
                      {p.latitude && p.longitude ? `${p.latitude}, ${p.longitude}` : "Unmapped"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">{p.status === 0 ? "Draft" : p.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <input
                         type="file"
                         id={`upload-${p.id}`}
                         className="hidden"
                         accept="image/*"
                         onChange={async (e) => {
                           if (!e.target.files?.length) return;
                           const formData = new FormData();
                           formData.append("file", e.target.files[0]);
                           try {
                             await api.post(`/images/upload/${p.id}`, formData, {
                               headers: { 'Content-Type': 'multipart/form-data' }
                             });
                             alert("Image uploaded!");
                           } catch (err) {
                             alert("Upload failed.");
                           }
                         }}
                       />
                       <label htmlFor={`upload-${p.id}`} className="cursor-pointer text-sm text-primary hover:underline">
                         Upload Image
                       </label>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}