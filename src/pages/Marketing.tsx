import { Plus, Edit, Trash2, Eye, Megaphone, Tag, Image, BarChart3, Calendar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

// Mock data
const campaigns = [
  {
    id: "CAMP-001",
    name: "Winter Sale 2024",
    type: "Seasonal Sale",
    status: "active",
    startDate: "2024-01-01",
    endDate: "2024-02-29", 
    budget: 5000,
    spent: 3200,
    impressions: 125000,
    clicks: 4500,
    conversions: 89
  },
  {
    id: "CAMP-002",
    name: "New Year Kickstart",
    type: "Email Campaign", 
    status: "completed",
    startDate: "2023-12-28",
    endDate: "2024-01-07",
    budget: 1500,
    spent: 1450,
    impressions: 45000,
    clicks: 2100,
    conversions: 67
  },
  {
    id: "CAMP-003",
    name: "Yamaha Parts Promotion",
    type: "Brand Focus",
    status: "active",
    startDate: "2024-01-10",
    endDate: "2024-02-10",
    budget: 3000,
    spent: 1800,
    impressions: 78000,
    clicks: 3200,
    conversions: 54
  },
  {
    id: "CAMP-004",
    name: "Performance Week",
    type: "Category Promotion",
    status: "scheduled",
    startDate: "2024-02-01",
    endDate: "2024-02-07",
    budget: 2500,
    spent: 0,
    impressions: 0,
    clicks: 0,
    conversions: 0
  }
];

const coupons = [
  {
    id: "COUP-001",
    code: "WINTER20",
    type: "Percentage",
    value: 20,
    minOrder: 100,
    uses: 145,
    limit: 500,
    status: "active",
    expiryDate: "2024-02-29"
  },
  {
    id: "COUP-002",
    code: "FREESHIP50",
    type: "Free Shipping",
    value: 0,
    minOrder: 50,
    uses: 89,
    limit: 200,
    status: "active", 
    expiryDate: "2024-03-31"
  },
  {
    id: "COUP-003",
    code: "YAMAHA15",
    type: "Percentage",
    value: 15,
    minOrder: 75,
    uses: 34,
    limit: 100,
    status: "active",
    expiryDate: "2024-02-10"
  },
  {
    id: "COUP-004",
    code: "NEWCUSTOMER",
    type: "Fixed Amount",
    value: 25,
    minOrder: 100,
    uses: 67,
    limit: 1000,
    status: "active",
    expiryDate: "2024-12-31"
  }
];

const banners = [
  {
    id: "BAN-001",
    name: "Winter Sale Hero Banner",
    type: "Hero",
    status: "active",
    clicks: 2340,
    impressions: 45000,
    location: "Homepage"
  },
  {
    id: "BAN-002", 
    name: "Yamaha Parts Sidebar",
    type: "Sidebar",
    status: "active",
    clicks: 890,
    impressions: 12000,
    location: "Product Pages"
  },
  {
    id: "BAN-003",
    name: "Free Shipping Footer",
    type: "Footer",
    status: "active",
    clicks: 456,
    impressions: 8900,
    location: "All Pages"
  }
];

export default function Marketing() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketing</h1>
          <p className="text-muted-foreground">
            Manage coupons, banners, and promotional campaigns.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create Campaign
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Campaigns</p>
                <p className="text-2xl font-bold">{campaigns.filter(c => c.status === "active").length}</p>
              </div>
              <Megaphone className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Impressions</p>
                <p className="text-2xl font-bold">{campaigns.reduce((sum, c) => sum + c.impressions, 0).toLocaleString()}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Coupon Usage</p>
                <p className="text-2xl font-bold">{coupons.reduce((sum, c) => sum + c.uses, 0)}</p>
              </div>
              <Tag className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ad Spend</p>
                <p className="text-2xl font-bold">${campaigns.reduce((sum, c) => sum + c.spent, 0).toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Marketing Tabs */}
      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
          <TabsTrigger value="banners">Banners</TabsTrigger>
        </TabsList>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Marketing Campaigns</CardTitle>
                <CardDescription>Manage and track your promotional campaigns</CardDescription>
              </div>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                New Campaign
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{campaign.name}</p>
                          <p className="text-sm text-muted-foreground">ID: {campaign.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-muted">
                          {campaign.type}
                        </span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge 
                          status={
                            campaign.status === "active" ? "success" :
                            campaign.status === "scheduled" ? "warning" : "info"
                          }
                        >
                          {campaign.status}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">${campaign.budget.toLocaleString()}</p>
                          <div className="w-24 bg-muted rounded-full h-2 mt-1">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            ${campaign.spent.toLocaleString()} spent
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{campaign.impressions.toLocaleString()} impressions</p>
                          <p>{campaign.clicks.toLocaleString()} clicks</p>
                          <p>{campaign.conversions} conversions</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{campaign.startDate}</p>
                          <p className="text-muted-foreground">to {campaign.endDate}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Coupons Tab */}
        <TabsContent value="coupons">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Discount Coupons</CardTitle>
                <CardDescription>Create and manage discount codes</CardDescription>
              </div>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Create Coupon
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Coupon Code</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Min Order</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coupons.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium font-mono text-lg">{coupon.code}</p>
                          <p className="text-sm text-muted-foreground">ID: {coupon.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-muted">
                          {coupon.type}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {coupon.type === "Percentage" ? `${coupon.value}%` : 
                           coupon.type === "Fixed Amount" ? `$${coupon.value}` : "Free"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{coupon.uses} / {coupon.limit}</p>
                          <Progress value={(coupon.uses / coupon.limit) * 100} className="w-20 h-2 mt-1" />
                        </div>
                      </TableCell>
                      <TableCell>${coupon.minOrder}</TableCell>
                      <TableCell>
                        <div className="text-sm">{coupon.expiryDate}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Banners Tab */}
        <TabsContent value="banners">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Website Banners</CardTitle>
                <CardDescription>Manage promotional banners and ads</CardDescription>
              </div>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Create Banner
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Banner Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {banners.map((banner) => (
                    <TableRow key={banner.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-8 bg-muted rounded flex items-center justify-center">
                            <Image className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{banner.name}</p>
                            <p className="text-sm text-muted-foreground">ID: {banner.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-muted">
                          {banner.type}
                        </span>
                      </TableCell>
                      <TableCell>{banner.location}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{banner.clicks.toLocaleString()} clicks</p>
                          <p className="text-muted-foreground">{banner.impressions.toLocaleString()} views</p>
                          <p className="text-muted-foreground">
                            {((banner.clicks / banner.impressions) * 100).toFixed(2)}% CTR
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status="success">Active</StatusBadge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}