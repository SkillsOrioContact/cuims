"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";

export default function EngineerDashboard() {
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

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Engineer Workspace</h1>
          <p className="text-muted-foreground mt-1">Manage project technical data, maps, and status.</p>
        </div>

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
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={5} className="text-center h-24"><Loader2 className="animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow>
                ) : projects?.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center h-24 text-muted-foreground">No projects found. Create one from the Superuser dashboard.</TableCell></TableRow>
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