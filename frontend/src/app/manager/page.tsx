"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";

export default function RoleDashboard() {
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

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manager Dashboard</h1>
          <p className="text-muted-foreground mt-1">View your assigned projects and pending feedback.</p>
        </div>

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