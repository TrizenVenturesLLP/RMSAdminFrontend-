import { Search, Filter, Plus, Eye, Edit, Trash2, Users as UsersIcon, UserCheck, UserX, Crown, Shield } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data
const users = [
  {
    id: "USER-001",
    name: "John Smith",
    email: "john.smith@email.com",
    role: "admin",
    status: "active",
    lastLogin: "2024-01-15 14:30",
    joinDate: "2023-06-15",
    orders: 23,
    totalSpent: 2450.99,
    avatar: "/placeholder.svg"
  },
  {
    id: "USER-002", 
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    role: "customer",
    status: "active",
    lastLogin: "2024-01-14 09:15",
    joinDate: "2023-08-22",
    orders: 12,
    totalSpent: 1299.50,
    avatar: "/placeholder.svg"
  },
  {
    id: "USER-003",
    name: "Mike Wilson",
    email: "m.wilson@email.com",
    role: "customer", 
    status: "active",
    lastLogin: "2024-01-13 16:45",
    joinDate: "2023-11-03",
    orders: 8,
    totalSpent: 899.99,
    avatar: "/placeholder.svg"
  },
  {
    id: "USER-004",
    name: "Emily Davis",
    email: "emily.davis@email.com",
    role: "editor",
    status: "active",
    lastLogin: "2024-01-15 11:20",
    joinDate: "2023-05-10",
    orders: 15,
    totalSpent: 1750.00,
    avatar: "/placeholder.svg"
  },
  {
    id: "USER-005",
    name: "Robert Brown",
    email: "robert.b@email.com", 
    role: "customer",
    status: "inactive",
    lastLogin: "2023-12-01 10:30",
    joinDate: "2023-03-18",
    orders: 5,
    totalSpent: 450.25,
    avatar: "/placeholder.svg"
  },
  {
    id: "USER-006",
    name: "Lisa Anderson",
    email: "lisa.anderson@email.com",
    role: "customer",
    status: "active",
    lastLogin: "2024-01-14 20:15",
    joinDate: "2023-09-07",
    orders: 18,
    totalSpent: 2100.75,
    avatar: "/placeholder.svg"
  },
  {
    id: "USER-007",
    name: "David Martinez",
    email: "d.martinez@email.com",
    role: "customer",
    status: "suspended",
    lastLogin: "2024-01-10 14:00",
    joinDate: "2023-07-25",
    orders: 3,
    totalSpent: 189.99,
    avatar: "/placeholder.svg"
  },
  {
    id: "USER-008",
    name: "Jennifer Lee",
    email: "jennifer.lee@email.com",
    role: "customer",
    status: "active",
    lastLogin: "2024-01-15 08:45",
    joinDate: "2023-10-12",
    orders: 9,
    totalSpent: 1050.50,
    avatar: "/placeholder.svg"
  }
];

export default function Users() {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="w-4 h-4 text-yellow-600" />;
      case "editor":
        return <Shield className="w-4 h-4 text-blue-600" />;
      default:
        return <UsersIcon className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <StatusBadge status="warning">Admin</StatusBadge>;
      case "editor":
        return <StatusBadge status="info">Editor</StatusBadge>;
      default:
        return <StatusBadge status="pending">Customer</StatusBadge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <StatusBadge status="success">Active</StatusBadge>;
      case "inactive":
        return <StatusBadge status="warning">Inactive</StatusBadge>;
      case "suspended":
        return <StatusBadge status="danger">Suspended</StatusBadge>;
      default:
        return <StatusBadge status="pending">{status}</StatusBadge>;
    }
  };

  const activeUsers = users.filter(u => u.status === "active").length;
  const totalCustomers = users.filter(u => u.role === "customer").length;
  const totalSpent = users.reduce((sum, u) => sum + u.totalSpent, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage customer accounts and admin users.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Shield className="w-4 h-4" />
            Manage Roles
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <UsersIcon className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Customers</p>
                <p className="text-2xl font-bold">{totalCustomers}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-blue-600"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${totalSpent.toLocaleString()}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-green-600"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Search and manage user accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by name, email, or user ID..."
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getRoleIcon(user.role)}
                      {getRoleBadge(user.role)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(user.status)}
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <span className="font-medium">{user.orders}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    ${user.totalSpent.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {user.lastLogin}
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
                        <UserX className="w-4 h-4" />
                      </Button>
                    </div>
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