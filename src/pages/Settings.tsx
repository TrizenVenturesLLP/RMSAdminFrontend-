import { Save, Upload, Globe, DollarSign, Bell, Shield, User, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure your shop settings and preferences.
        </p>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="w-5 h-5" />
                  Store Information
                </CardTitle>
                <CardDescription>Basic information about your motorcycle shop</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="store-name">Store Name</Label>
                    <Input id="store-name" defaultValue="Riders Moto Shop" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="store-email">Contact Email</Label>
                    <Input id="store-email" type="email" defaultValue="info@ridersshop.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store-description">Store Description</Label>
                  <Textarea 
                    id="store-description" 
                    defaultValue="Premium motorcycle parts and accessories for riders worldwide. Specializing in Yamaha, Honda, Kawasaki, and Suzuki parts."
                    rows={3}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="store-phone">Phone Number</Label>
                    <Input id="store-phone" defaultValue="+1 (555) 123-4567" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="store-website">Website URL</Label>
                    <Input id="store-website" defaultValue="https://ridersshop.com" />
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="store-address">Store Address</Label>
                  <Textarea 
                    id="store-address"
                    defaultValue="123 Motor Street, Bike City, BC 12345, United States"
                    rows={2}
                  />
                </div>
                <Button className="gap-2">
                  <Save className="w-4 h-4" />
                  Save Store Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Regional Settings
                </CardTitle>
                <CardDescription>Configure regional and localization settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="utc-5">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                        <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                        <SelectItem value="utc+0">GMT (UTC+0)</SelectItem>
                        <SelectItem value="utc+1">Central European (UTC+1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Default Currency</Label>
                    <Select defaultValue="usd">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD - US Dollar</SelectItem>
                        <SelectItem value="eur">EUR - Euro</SelectItem>
                        <SelectItem value="gbp">GBP - British Pound</SelectItem>
                        <SelectItem value="cad">CAD - Canadian Dollar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button className="gap-2">
                  <Save className="w-4 h-4" />
                  Save Regional Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payments">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Payment Methods
                </CardTitle>
                <CardDescription>Configure accepted payment methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Credit/Debit Cards</p>
                      <p className="text-sm text-muted-foreground">Accept Visa, Mastercard, American Express</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">PayPal</p>
                      <p className="text-sm text-muted-foreground">Accept PayPal payments</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Bank Transfer</p>
                      <p className="text-sm text-muted-foreground">Direct bank transfers</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Cash on Delivery</p>
                      <p className="text-sm text-muted-foreground">Payment upon delivery</p>
                    </div>
                    <Switch />
                  </div>
                </div>
                <Separator />
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                    <Input id="tax-rate" type="number" defaultValue="8.5" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="processing-fee">Processing Fee (%)</Label>
                    <Input id="processing-fee" type="number" defaultValue="2.9" />
                  </div>
                </div>
                <Button className="gap-2">
                  <Save className="w-4 h-4" />
                  Save Payment Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Email Notifications
                </CardTitle>
                <CardDescription>Configure when you receive email notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">New Orders</p>
                      <p className="text-sm text-muted-foreground">Get notified when new orders are placed</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Low Stock Alerts</p>
                      <p className="text-sm text-muted-foreground">Alert when products are running low</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Payment Confirmations</p>
                      <p className="text-sm text-muted-foreground">Confirm when payments are received</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Customer Reviews</p>
                      <p className="text-sm text-muted-foreground">Notify when customers leave reviews</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Marketing Updates</p>
                      <p className="text-sm text-muted-foreground">Campaign performance and updates</p>
                    </div>
                    <Switch />
                  </div>
                </div>
                <Button className="gap-2">
                  <Save className="w-4 h-4" />
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security & Privacy
                </CardTitle>
                <CardDescription>Manage your account security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Login Notifications</p>
                      <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                <Button className="gap-2">
                  <Save className="w-4 h-4" />
                  Update Security Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Admin Profile
                </CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline" className="gap-2">
                      <Upload className="w-4 h-4" />
                      Upload Photo
                    </Button>
                    <p className="text-sm text-muted-foreground">JPG, PNG or GIF. Max 2MB</p>
                  </div>
                </div>
                <Separator />
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" defaultValue="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" defaultValue="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email Address</Label>
                  <Input id="admin-email" type="email" defaultValue="admin@ridersshop.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+1 (555) 987-6543" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select defaultValue="admin" disabled>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="gap-2">
                  <Save className="w-4 h-4" />
                  Update Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}