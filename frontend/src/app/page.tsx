"use client";

import { Activity, Folders, Map as MapIcon, Users, AlertCircle, ArrowUpRight, ArrowDownRight, Clock, Loader2, BarChart3, ChevronRight, PlusCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import dynamic from 'next/dynamic';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ProjectMap = dynamic(() => import('@/components/maps/ProjectMap'), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full flex items-center justify-center bg-muted/20 border border-dashed rounded-md"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
});

// Mock Data
const kpis = [
  {
    title: "Total Projects",
    value: "1,248",
    icon: Folders,
    description: "+12 from last month",
    trend: "up"
  },
  {
    title: "At Risk / Delayed",
    value: "14",
    icon: AlertCircle,
    description: "-2 from last month",
    trend: "down"
  },
  {
    title: "Pending Approvals",
    value: "42",
    icon: Clock,
    description: "Requires Manager Review",
    trend: "neutral"
  },
  {
    title: "Active Users",
    value: "892",
    icon: Users,
    description: "+34 this week",
    trend: "up"
  }
];

const recentActivity = [
  { id: 1, action: "Project Created", detail: "Bridge Foundation Phase 2", user: "Sarah Jenkins", role: "Manager", time: "10 mins ago" },
  { id: 2, action: "Role Updated", detail: "John Doe changed to Engineer", user: "System Admin", role: "Superuser", time: "1 hr ago" },
  { id: 3, action: "Comment Resolved", detail: "Safety compliance check", user: "Mike Ross", role: "Engineer", time: "2 hrs ago" },
  { id: 4, action: "Map Marker Updated", detail: "Site B Coordinates", user: "Sarah Jenkins", role: "Manager", time: "4 hrs ago" },
  { id: 5, action: "New User Registered", detail: "Alex Taylor (Viewer)", user: "System Admin", role: "Superuser", time: "1 day ago" },
  { id: 6, action: "Budget Updated", detail: "Highway Expansion", user: "Finance Dept", role: "Admin", time: "1 day ago" },
];

const financialData = [
  { name: 'Jan', budget: 4000, spent: 2400 },
  { name: 'Feb', budget: 3000, spent: 1398 },
  { name: 'Mar', budget: 2000, spent: 9800 },
  { name: 'Apr', budget: 2780, spent: 3908 },
  { name: 'May', budget: 1890, spent: 4800 },
  { name: 'Jun', budget: 2390, spent: 3800 },
];

const atRiskProjects = [
  { id: "PRJ-092", name: "Downtown Bypass", region: "North Region", status: "Delayed", manager: "A. Smith", progress: 45 },
  { id: "PRJ-104", name: "Water Treatment Plant", region: "West City", status: "Critical", manager: "M. Jones", progress: 12 },
  { id: "PRJ-115", name: "Highway Expansion", region: "East Coast", status: "Delayed", manager: "T. Baker", progress: 78 },
  { id: "PRJ-118", name: "Subway Extension", region: "South City", status: "Critical", manager: "L. Davis", progress: 34 },
];

export default function Dashboard() {
  const { data: projects, isLoading: isProjectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      // In a real environment, this will hit our ASP.NET Backend
      try {
        const { data } = await api.get('/projects');
        return data.length > 0 ? data : atRiskProjects; // Fallback to mock if db is empty
      } catch (e) {
        return atRiskProjects;
      }
    }
  });

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Superuser Overview</h1>
            <p className="text-muted-foreground mt-1">Enterprise infrastructure management and system health monitoring.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="hidden md:flex">
              <Users className="mr-2 h-4 w-4" />
              Invite User
            </Button>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi, index) => (
            <Card key={index} className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
                <div className={`p-2 rounded-full ${
                  kpi.trend === 'up' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' :
                  kpi.trend === 'down' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' :
                  'bg-blue-100 text-blue-600 dark:bg-blue-900/30'
                }`}>
                  <kpi.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tracking-tight">{kpi.value}</div>
                <p className="text-xs text-muted-foreground flex items-center mt-2">
                  {kpi.trend === "up" && <ArrowUpRight className="mr-1 h-3 w-3 text-emerald-500" />}
                  {kpi.trend === "down" && <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />}
                  {kpi.trend === "neutral" && <span className="mr-1 text-blue-500">•</span>}
                  {kpi.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Map Overview</TabsTrigger>
            <TabsTrigger value="analytics">Financial Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              {/* Map View */}
              <Card className="col-span-4 shadow-sm border-muted">
                <CardHeader>
                  <CardTitle>Geographic Distribution</CardTitle>
                  <CardDescription>
                    Live spatial tracking of infrastructure projects via OpenStreetMap.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 overflow-hidden rounded-b-xl border-t">
                  <ProjectMap projects={projects || []} />
                </CardContent>
              </Card>

              {/* Activity Feed */}
              <Card className="col-span-3 shadow-sm border-muted flex flex-col">
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle>Audit & Activity Log</CardTitle>
                    <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground">
                      View All
                    </Button>
                  </div>
                  <CardDescription>
                    System-wide operations and user activity.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 flex-1">
                  <ScrollArea className="h-[360px] w-full">
                    <div className="p-4 space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div key={activity.id} className="flex items-start gap-4">
                          <div className="mt-1">
                            <div className="h-2 w-2 rounded-full bg-primary ring-4 ring-primary/10" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">{activity.action}</p>
                            <p className="text-sm text-muted-foreground">
                              {activity.detail}
                            </p>
                            <div className="flex items-center pt-2 text-xs text-muted-foreground">
                              <span className="font-medium text-foreground">{activity.user}</span>
                              <span className="mx-2">•</span>
                              <span>{activity.role}</span>
                              <span className="mx-2">•</span>
                              <span>{activity.time}</span>
                            </div>
                          </div>
                          {index !== recentActivity.length - 1 && (
                            <div className="absolute left-[21px] mt-4 h-full w-px bg-border" />
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
             <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Budget vs. Expenditure</CardTitle>
                  <CardDescription>Monthly financial performance across all regions.</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={financialData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                        <Tooltip cursor={{fill: 'transparent'}} />
                        <Legend iconType="circle" />
                        <Bar dataKey="budget" name="Allocated Budget" fill="#94a3b8" radius={[4, 4, 0, 0]} maxBarSize={40} />
                        <Bar dataKey="spent" name="Actual Spent" fill="#0f172a" radius={[4, 4, 0, 0]} maxBarSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
          </TabsContent>
        </Tabs>

        {/* Priority Action Table */}
        <Card className="shadow-sm border-muted">
          <CardHeader className="border-b bg-muted/20">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Attention Required</CardTitle>
                <CardDescription>Projects flagged as Critical or Delayed.</CardDescription>
              </div>
              <Button variant="secondary" size="sm">
                Generate Report
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/10">
                <TableRow>
                  <TableHead className="w-[120px] pl-6">Project ID</TableHead>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead className="text-right pr-6">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isProjectsLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ) : projects?.map((project: any) => (
                  <TableRow key={project.id} className="hover:bg-muted/50 cursor-pointer group">
                    <TableCell className="font-medium pl-6 text-muted-foreground group-hover:text-primary transition-colors">
                      {project.id.toString().substring(0,8)}
                    </TableCell>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell className="text-muted-foreground">{project.region || 'Unassigned'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                          {project.manager ? project.manager.charAt(0) : 'U'}
                        </div>
                        <span className="text-sm">{project.manager || 'Unassigned'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${project.progress || Math.floor(Math.random() * 80) + 10}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{project.progress || '45'}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Badge variant={project.status === "Critical" ? "destructive" : "secondary"}>
                        {project.status || 'Delayed'}
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
