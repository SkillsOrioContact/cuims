"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Plus, MoreHorizontal, Building2, Search, Filter, FolderPlus, MapPin, CheckCircle2, Clock } from "lucide-react";
import api from "@/lib/api";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "In Progress": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    case "Delayed": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
    case "Critical": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
  }
};

const mockProjects = [
  { id: "PRJ-092", name: "Downtown Bypass", type: "Roadway", location: "North Region", status: "In Progress", contractCost: 4500000, progress: 45, manager: "Sarah Jenkins" },
  { id: "PRJ-104", name: "Water Treatment Plant", type: "Utility", location: "West City", status: "Critical", contractCost: 12500000, progress: 12, manager: "Mike Ross" },
  { id: "PRJ-115", name: "Highway Expansion", type: "Roadway", location: "East Coast", status: "Delayed", contractCost: 8200000, progress: 78, manager: "Alex Taylor" },
  { id: "PRJ-118", name: "Subway Extension", type: "Transit", location: "South City", status: "Completed", contractCost: 42000000, progress: 100, manager: "David Kim" },
  { id: "PRJ-121", name: "City Hall Renovation", type: "Building", location: "Central", status: "In Progress", contractCost: 3500000, progress: 62, manager: "Emily Chen" },
];

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      try {
        const { data } = await api.get("/projects");
        return data.length > 0 ? data : mockProjects; // Fallback to mock data for layout purposes
      } catch (err) {
        return mockProjects;
      }
    }
  });

  const filteredProjects = projects?.filter((p: any) =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.manager?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Infrastructure Projects</h1>
            <p className="text-muted-foreground mt-1">Manage, track, and analyze all enterprise infrastructure deployments.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="hidden md:flex">
              <FolderPlus className="mr-2 h-4 w-4" /> Import Data
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create Project
            </Button>
          </div>
        </div>

        <Card className="shadow-sm border-muted">
          <CardHeader className="border-b bg-muted/20 pb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search projects by name, ID, or manager..."
                    className="pl-8 bg-background"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon" className="shrink-0 bg-background">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="outline" className="font-normal bg-background">All: {projects?.length || 0}</Badge>
                <Badge variant="outline" className="font-normal bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">Completed: 1</Badge>
                <Badge variant="outline" className="font-normal bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800">Critical: 1</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/10">
                <TableRow>
                  <TableHead className="w-[300px] pl-6">Project</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Financials (Est.)</TableHead>
                  <TableHead>Status / Progress</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={6} className="text-center h-32"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow>
                ) : filteredProjects?.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center h-32 text-muted-foreground">No projects matched your search criteria.</TableCell></TableRow>
                ) : filteredProjects?.map((p: any) => {
                  const statusClass = getStatusColor(p.status);

                  return (
                  <TableRow key={p.id} className="hover:bg-muted/50 transition-colors cursor-pointer group">
                    <TableCell className="pl-6">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 bg-primary/10 p-2 rounded-md text-primary">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{p.name}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            ID: {typeof p.id === 'string' ? p.id.substring(0,8) : p.id} • {p.type || 'Infrastructure'}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground mr-1.5" />
                        {p.location || p.region || 'Unassigned'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{p.manager || 'Pending Assignment'}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          ${(p.contractCost || 0).toLocaleString()}
                        </span>
                        <span className="text-xs text-muted-foreground">Contract Cost</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1.5 w-32">
                        <div className="flex items-center justify-between text-xs">
                          <span className={`px-2 py-0.5 rounded-full font-medium ${statusClass}`}>
                            {p.status || 'In Progress'}
                          </span>
                          <span className="font-medium text-muted-foreground">{p.progress || 0}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${p.status === 'Critical' ? 'bg-red-500' : p.status === 'Completed' ? 'bg-emerald-500' : 'bg-primary'}`}
                            style={{ width: `${p.progress || 0}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger render={
                          <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        } />
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Project Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Building2 className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MapPin className="mr-2 h-4 w-4" /> Map Location
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Clock className="mr-2 h-4 w-4" /> Audit History
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-emerald-600 focus:bg-emerald-50 focus:text-emerald-700">
                            <CheckCircle2 className="mr-2 h-4 w-4" /> Mark Completed
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )})}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
