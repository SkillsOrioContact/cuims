"use client";

import { Activity, Folders, Map as MapIcon, Users, AlertCircle, ArrowUpRight, ArrowDownRight, Clock, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import dynamic from 'next/dynamic';

const ProjectMap = dynamic(() => import('@/components/maps/ProjectMap'), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full flex items-center justify-center bg-muted/20 border border-dashed rounded-md"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
});

// Mock Data
const kpis = [
  {
    title: "Total Active Projects",
    value: "142",
    icon: Folders,
    description: "+12 from last month",
    trend: "up"
  },
  {
    title: "Projects at Risk",
    value: "8",
    icon: AlertCircle,
    description: "-2 from last month",
    trend: "down"
  },
  {
    title: "Open Feedback",
    value: "24",
    icon: Clock,
    description: "Pending Manager Review",
    trend: "neutral"
  },
  {
    title: "Total Users",
    value: "89",
    icon: Users,
    description: "+3 this week",
    trend: "up"
  }
];

const recentActivity = [
  { id: 1, action: "Project Created", detail: "Bridge Foundation Phase 2", user: "Admin Sarah", time: "2 hours ago" },
  { id: 2, action: "Role Updated", detail: "John Doe changed to Engineer", user: "Superuser", time: "4 hours ago" },
  { id: 3, action: "Comment Resolved", detail: "Safety compliance check", user: "Manager Mike", time: "5 hours ago" },
  { id: 4, action: "Map Marker Updated", detail: "Site B Coordinates", user: "Admin Sarah", time: "1 day ago" },
];

const atRiskProjects = [
  { id: "PRJ-092", name: "Downtown Bypass", region: "North Region", status: "Delayed", manager: "A. Smith" },
  { id: "PRJ-104", name: "Water Treatment Plant", region: "West City", status: "Critical", manager: "M. Jones" },
  { id: "PRJ-115", name: "Highway Expansion", region: "East Coast", status: "Delayed", manager: "T. Baker" },
];

export default function Dashboard() {
  const { data: projects, isLoading: isProjectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      // In a real environment, this will hit our ASP.NET Backend
      try {
        const { data } = await api.get('/projects');
        return data;
      } catch (e) {
        // Fallback to mock data if backend isn't running yet during scaffolding
        return atRiskProjects;
      }
    }
  });

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Superuser Dashboard</h1>
            <p className="text-muted-foreground mt-1">Overview of infrastructure projects and system health.</p>
          </div>
          <div className="flex gap-2">
            <Button>
              <Folders className="mr-2 h-4 w-4" />
              New Project
            </Button>
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <kpi.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  {kpi.trend === "up" && <ArrowUpRight className="mr-1 h-3 w-3 text-emerald-500" />}
                  {kpi.trend === "down" && <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />}
                  {kpi.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Main Chart Placeholder */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>
                Live OpenStreetMap tracking of infrastructure projects.
              </CardDescription>
            </CardHeader>
            <CardContent>
               <ProjectMap projects={projects || []} />
            </CardContent>
          </Card>

          {/* Recent Activity List */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>System Activity</CardTitle>
              <CardDescription>
                Recent audit logs and operations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.detail}
                      </p>
                    </div>
                    <div className="ml-auto font-medium text-xs text-right space-y-1">
                      <p>{activity.user}</p>
                      <p className="text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Projects at Risk</CardTitle>
            <CardDescription>Infrastructure projects requiring immediate attention.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isProjectsLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ) : projects?.map((project: any) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.id.toString().substring(0,8)}</TableCell>
                    <TableCell>{project.name}</TableCell>
                    <TableCell>{project.region}</TableCell>
                    <TableCell>{project.manager}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={project.status === "Critical" ? "destructive" : "secondary"}>
                        {project.status}
                      </Badge>
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
