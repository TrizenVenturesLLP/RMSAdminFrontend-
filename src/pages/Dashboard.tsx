import { Package, ShoppingCart, DollarSign, AlertTriangle, TrendingUp, Eye, Edit } from "lucide-react";
import { StatsCard } from "@/components/ui/stats-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data
const recentOrders = [
  {
    id: "#ORD-001",
    customer: "John Smith",
    date: "2024-01-15",
    amount: "$299.99",
    status: "completed" as const,
    items: 3,
  },
  {
    id: "#ORD-002",
    customer: "Sarah Johnson",
    date: "2024-01-15",
    amount: "$149.50",
    status: "pending" as const,
    items: 2,
  },
  {
    id: "#ORD-003",
    customer: "Mike Wilson",
    date: "2024-01-14",
    amount: "$89.99",
    status: "processing" as const,
    items: 1,
  },
  {
    id: "#ORD-004",
    customer: "Emily Davis",
    date: "2024-01-14",
    amount: "$459.99",
    status: "completed" as const,
    items: 5,
  },
  {
    id: "#ORD-005",
    customer: "Robert Brown",
    date: "2024-01-13",
    amount: "$199.99",
    status: "cancelled" as const,
    items: 2,
  },
];

const lowStockItems = [
  { name: "Yamaha MT-09 Air Filter", stock: 3, threshold: 10 },
  { name: "Honda CBR600RR Brake Pads", stock: 5, threshold: 15 },
  { name: "Kawasaki Ninja 300 Chain", stock: 2, threshold: 8 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening at your shop today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Products"
          value="1,234"
          description="Active listings"
          icon={Package}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Total Orders"
          value="589"
          description="This month"
          icon={ShoppingCart}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Revenue"
          value="$23,456"
          description="This month"
          icon={DollarSign}
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="Low Stock Alerts"
          value="12"
          description="Items need restocking"
          icon={AlertTriangle}
          className="border-yellow-200"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        {/* Recent Orders */}
        <Card className="lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest customer orders from your shop</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.items}</TableCell>
                    <TableCell className="font-medium">{order.amount}</TableCell>
                    <TableCell>
                      <StatusBadge
                        status={
                          order.status === "completed"
                            ? "success"
                            : order.status === "pending"
                            ? "warning"
                            : order.status === "processing"
                            ? "info"
                            : "danger"
                        }
                      >
                        {order.status}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Actions & Low Stock */}
        <div className="lg:col-span-3 space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks for managing your shop</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => {
                  // Navigate to products page and trigger modal
                  window.location.href = '/products';
                  setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('open-product-modal'));
                  }, 100);
                }}
              >
                <Package className="w-4 h-4 mr-2" />
                Add New Product
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Manage Categories
              </Button>
            </CardContent>
          </Card>

          {/* Low Stock Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                Low Stock Alerts
              </CardTitle>
              <CardDescription>Items that need restocking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lowStockItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.stock} left (min: {item.threshold})
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Restock
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}