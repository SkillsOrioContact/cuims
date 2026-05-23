"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";

export default function AccountsDashboard() {
  const { data: projects, isLoading } = useQuery({
    queryKey: ["finance-projects"],
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
          <h1 className="text-3xl font-bold tracking-tight">Accounts Branch</h1>
          <p className="text-muted-foreground mt-1">Enterprise financial monitoring for infrastructure projects.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project Financial Ledgers</CardTitle>
            <CardDescription>Review contract costs, TS, AA, and remaining balances.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead className="text-right">Contract Cost</TableHead>
                  <TableHead className="text-right">TS Cost</TableHead>
                  <TableHead className="text-right">AA Cost</TableHead>
                  <TableHead className="text-right text-primary font-bold">Total Paid</TableHead>
                  <TableHead className="text-right text-destructive font-bold">Remaining</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={6} className="text-center h-24"><Loader2 className="animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow>
                ) : projects?.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center h-24 text-muted-foreground">No financial records found.</TableCell></TableRow>
                ) : projects?.map((p: any) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="text-right font-mono">${p.contractCost?.toLocaleString() ?? 0}</TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">${p.tsCost?.toLocaleString() ?? 0}</TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">${p.aaCost?.toLocaleString() ?? 0}</TableCell>
                    <TableCell className="text-right font-mono text-primary">${p.totalAmountPaid?.toLocaleString() ?? 0}</TableCell>
                    <TableCell className="text-right font-mono text-destructive">${(p.contractCost - p.totalAmountPaid)?.toLocaleString() ?? 0}</TableCell>
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