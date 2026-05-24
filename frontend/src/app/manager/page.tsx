"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, MessageSquarePlus } from "lucide-react";
import api from "@/lib/api";

export default function RoleDashboard() {
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ projectId: "", text: "" });

  const { data: comments, isLoading } = useQuery({
    queryKey: ["manager-comments"],
    queryFn: async () => {
      try {
        const { data } = await api.get("/projectcomments");
        return data;
      } catch (e) {
        return [];
      }
    }
  });

  const createCommentMutation = useMutation({
    mutationFn: async (data: any) => await api.post("/projectcomments", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manager-comments"] });
      setShowAddForm(false);
      setFormData({ projectId: "", text: "" });
    }
  });

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manager Dashboard</h1>
            <p className="text-muted-foreground mt-1">View your assigned projects and pending feedback.</p>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <MessageSquarePlus className="mr-2 h-4 w-4" /> Add Feedback
          </Button>
        </div>

        {showAddForm && (
          <Card className="border-primary/50 shadow-md">
            <CardHeader>
              <CardTitle>Submit Project Feedback</CardTitle>
              <CardDescription>Engineers will review and resolve this item.</CardDescription>
            </CardHeader>
            <form onSubmit={(e) => { e.preventDefault(); createCommentMutation.mutate(formData); }}>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Project ID (UUID)</Label>
                  <Input required value={formData.projectId} onChange={e => setFormData({...formData, projectId: e.target.value})} placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Feedback Details</Label>
                  <Input required value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})} placeholder="e.g. Safety review required for phase 2." />
                </div>
              </CardContent>
              <div className="px-6 pb-6 flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => setShowAddForm(false)}>Cancel</Button>
                <Button type="submit" disabled={createCommentMutation.isPending}>
                  {createCommentMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Submit
                </Button>
              </div>
            </form>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Feedback Loop Center</CardTitle>
            <CardDescription>Monitor the status of your submitted comments.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                {isLoading ? (
                  <div className="flex justify-center p-6"><Loader2 className="animate-spin text-muted-foreground" /></div>
                ) : comments?.length === 0 ? (
                  <p className="text-muted-foreground text-center py-6">No feedback submitted yet.</p>
                ) : comments?.map((comment: any) => (
                  <div key={comment.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div>
                      <p className="font-medium">{comment.text}</p>
                      <p className="text-sm text-muted-foreground">Project: {comment.projectName}</p>
                      {comment.adminRemarks && (
                        <p className="text-xs mt-1 text-muted-foreground italic">Admin Remark: {comment.adminRemarks}</p>
                      )}
                    </div>
                    {comment.isRejected ? (
                      <Badge variant="destructive">Rejected</Badge>
                    ) : comment.isResolved ? (
                      <Badge className="bg-emerald-500 hover:bg-emerald-600">Resolved</Badge>
                    ) : (
                      <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending Review</Badge>
                    )}
                  </div>
                ))}
             </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}