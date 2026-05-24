"use client";

import { User, Mail, ShieldAlert, Key, Building2, MapPin, Activity, CalendarDays, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DashboardLayout from "@/components/layout/dashboard-layout";

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 pb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your account settings and preferences.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Left Column - Profile Card */}
          <div className="md:col-span-1 space-y-6">
            <Card className="border-muted shadow-sm overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-primary/10 to-primary/30 w-full" />
              <CardContent className="px-6 pb-6 pt-0 flex flex-col items-center">
                <div className="h-20 w-20 rounded-full border-4 border-background bg-primary/10 text-primary flex items-center justify-center -mt-10 mb-4 shadow-sm">
                  <span className="text-2xl font-bold">SU</span>
                </div>
                <h3 className="text-xl font-bold">Superuser Admin</h3>
                <p className="text-sm text-muted-foreground">super@admin.com</p>
                <div className="flex gap-2 mt-4">
                  <Badge variant="default" className="bg-primary/20 text-primary hover:bg-primary/30 border-transparent">
                    Superuser
                  </Badge>
                  <Badge variant="outline">System Admin</Badge>
                </div>
              </CardContent>
              <div className="border-t bg-muted/20 p-4">
                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Building2 className="h-4 w-4" /> Department
                    </span>
                    <span className="font-medium">IT Infrastructure</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> Location
                    </span>
                    <span className="font-medium">Headquarters</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" /> Joined
                    </span>
                    <span className="font-medium">Jan 2023</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-muted shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-md flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  Recent Account Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">Successful Login</p>
                    <p className="text-muted-foreground text-xs">Today, 08:42 AM • IP: 192.168.1.1</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">Password Changed</p>
                    <p className="text-muted-foreground text-xs">May 15, 2023 • System Prompt</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Settings Form */}
          <div className="md:col-span-2 space-y-6">
            <Card className="border-muted shadow-sm">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details and contact information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="Superuser" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Admin" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input id="email" defaultValue="super@admin.com" className="pl-9 bg-muted/30" readOnly />
                  </div>
                  <p className="text-[0.8rem] text-muted-foreground">Email address cannot be changed directly. Contact support.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="+1 (555) 000-0000" />
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/20 justify-end py-4">
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>

            <Card className="border-muted shadow-sm border-destructive/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Security
                </CardTitle>
                <CardDescription>Manage your password and security preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current">Current Password</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new">New Password</Label>
                    <Input id="new" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm">Confirm Password</Label>
                    <Input id="confirm" type="password" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/20 justify-between py-4">
                 <p className="text-[0.8rem] text-muted-foreground">Last changed 4 months ago.</p>
                <Button variant="secondary">Update Password</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
