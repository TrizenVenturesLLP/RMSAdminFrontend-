import { Search, Filter, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data
const orders = [
  {
    id: "#ORD-001",
    customer: "John Smith",
    email: "john@example.com",
    date: "2024-01-15",
    items: 3,
    total: "$299.99",
    payment: "completed",
    fulfillment: "shipped",
    status: "completed",
  },
  {
    id: "#ORD-002",
    customer: "Sarah Johnson", 
    email: "sarah@example.com",
    date: "2024-01-15",
    items: 2,
    total: "$149.50",
    payment: "completed",
    fulfillment: "pending",
    status: "processing",
  },
  {
    id: "#ORD-003",
    customer: "Mike Wilson",
    email: "mike@example.com", 
    date: "2024-01-14",
    items: 1,
    total: "$89.99",
    payment: "pending",
    fulfillment: "pending",
    status: "pending",
  },
  {
    id: "#ORD-004",
    customer: "Emily Davis",
    email: "emily@example.com",
    date: "2024-01-14", 
    items: 5,
    total: "$459.99",
    payment: "completed",
    fulfillment: "delivered",
    status: "completed",
  },
  {
    id: "#ORD-005",
    customer: "Robert Brown",
    email: "robert@example.com",
    date: "2024-01-13",
    items: 2,
    total: "$199.99",
    payment: "failed",
    fulfillment: "cancelled",
    status: "cancelled",
  },
];

export default function Orders() {
  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <StatusBadge status="success">Paid</StatusBadge>;
      case "pending":
        return <StatusBadge status="warning">Pending</StatusBadge>;
      case "failed":
        return <StatusBadge status="danger">Failed</StatusBadge>;
      default:
        return <StatusBadge status="info">{status}</StatusBadge>;
    }
  };

  const getFulfillmentBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <StatusBadge status="success">Delivered</StatusBadge>;
      case "shipped":
        return <StatusBadge status="info">Shipped</StatusBadge>;
      case "pending":
        return <StatusBadge status="warning">Pending</StatusBadge>;
      case "cancelled":
        return <StatusBadge status="danger">Cancelled</StatusBadge>;
      default:
        return <StatusBadge status="info">{status}</StatusBadge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            Track and manage customer orders from your motorcycle shop.
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export Orders
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
          <CardDescription>Search and filter customer orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by order ID, customer name, or email..."
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="completed">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Date Range
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Fulfillment</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.customer}</p>
                      <p className="text-sm text-muted-foreground">{order.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell className="font-medium">{order.total}</TableCell>
                  <TableCell>
                    {getPaymentBadge(order.payment)}
                  </TableCell>
                  <TableCell>
                    {getFulfillmentBadge(order.fulfillment)}
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
    </div>
  );
}