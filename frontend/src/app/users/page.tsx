"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import api from "@/lib/api";

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
            <p className="text-muted-foreground mt-1">Superuser portal to manage organization access.</p>
          </div>
          <Button onClick={() => setShowAddUser(!showAddUser)}>
            <Plus className="mr-2 h-4 w-4" /> Add User
          </Button>
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

        <Card>
          <CardHeader>
            <CardTitle>Active Directory</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Superuser Notes</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={4} className="text-center h-24"><Loader2 className="animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow>
                ) : users?.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center h-24 text-muted-foreground">No users found. Ensure backend is running.</TableCell></TableRow>
                ) : users?.map((u: any) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.userName}</TableCell>
                    <TableCell>{u.fullName || '-'}</TableCell>
                    <TableCell className="text-muted-foreground italic text-xs">{u.superuserNotes || '-'}</TableCell>
                    <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
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