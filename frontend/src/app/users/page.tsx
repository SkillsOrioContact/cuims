"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, MoreHorizontal, Shield, Mail, Edit, Trash2, KeyRound } from "lucide-react";
import api from "@/lib/api";

// Mock Data for Roles since it's not fully provided by backend yet
const rolesMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  "Superuser": { label: "Superuser", variant: "default" },
  "Admin": { label: "Admin", variant: "secondary" },
  "Manager": { label: "Manager", variant: "outline" },
  "Engineer": { label: "Engineer", variant: "outline" },
  "Viewer": { label: "Viewer", variant: "outline" },
};

export default function UsersManagementPage() {
  const queryClient = useQueryClient();
  const [showAddUser, setShowAddUser] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "", fullName: "", role: "Manager", superuserNotes: "" });

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const { data } = await api.get("/users");
        return data;
      } catch (err) {
        return [];
      }
    }
  });

  const createUserMutation = useMutation({
    mutationFn: async (newUser: any) => {
      return await api.post("/users", newUser);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setShowAddUser(false);
      setFormData({ username: "", password: "", fullName: "", role: "Manager", superuserNotes: "" });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUserMutation.mutate(formData);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Directory</h1>
            <p className="text-muted-foreground mt-1">Enterprise RBAC and personnel management.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-64 hidden md:block">
              <Input placeholder="Search users..." className="bg-background" />
            </div>
            <Button onClick={() => setShowAddUser(!showAddUser)}>
              <Plus className="mr-2 h-4 w-4" /> Add User
            </Button>
          </div>
        </div>

        {showAddUser && (
          <Card className="border-primary/50 shadow-md">
            <CardHeader>
              <CardTitle>Create New User</CardTitle>
              <CardDescription>Accounts are invite-only. Password must be changed on first login.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Initial Password</Label>
                  <Input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Superuser Notes (Private)</Label>
                  <Input value={formData.superuserNotes} onChange={e => setFormData({...formData, superuserNotes: e.target.value})} />
                </div>
              </CardContent>
              <div className="px-6 pb-6 flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => setShowAddUser(false)}>Cancel</Button>
                <Button type="submit" disabled={createUserMutation.isPending}>
                  {createUserMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save User
                </Button>
              </div>
            </form>
          </Card>
        )}

        <Card className="shadow-sm border-muted">
          <CardHeader className="border-b bg-muted/20">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Active Directory</CardTitle>
                <CardDescription>Manage user roles, statuses, and system access.</CardDescription>
              </div>
              <Badge variant="outline" className="font-normal text-muted-foreground">
                {users?.length || 0} Total Users
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/10">
                <TableRow>
                  <TableHead className="w-[300px] pl-6">User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={5} className="text-center h-32"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow>
                ) : users?.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center h-32 text-muted-foreground">No users found in directory.</TableCell></TableRow>
                ) : users?.map((u: any) => {
                  // Fallbacks for missing backend data
                  const role = u.role || (u.userName === 'superuser' ? 'Superuser' : 'Engineer');
                  const roleConfig = rolesMap[role] || { label: role, variant: "outline" };
                  const department = u.department || "Infrastructure";
                  const status = u.isActive !== false ? "Active" : "Inactive";
                  const initials = u.fullName ? u.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase() : u.userName.substring(0,2).toUpperCase();

                  return (
                  <TableRow key={u.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-primary/10">
                          <AvatarFallback className={role === 'Superuser' ? 'bg-primary/20 text-primary font-semibold' : 'bg-muted text-muted-foreground'}>
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{u.fullName || u.userName}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {u.userName}@infrapm.local
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={roleConfig.variant} className={role === 'Superuser' ? 'bg-primary/20 text-primary hover:bg-primary/30 border-transparent' : ''}>
                        {role === 'Superuser' && <Shield className="mr-1 h-3 w-3" />}
                        {roleConfig.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{department}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${status === 'Active' ? 'bg-emerald-500' : 'bg-muted-foreground'}`} />
                        <span className="text-sm">{status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger render={
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        } />
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" /> Edit Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Shield className="mr-2 h-4 w-4" /> Change Role
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <KeyRound className="mr-2 h-4 w-4" /> Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Deactivate User
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