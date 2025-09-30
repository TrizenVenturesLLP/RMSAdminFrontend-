import { Search, Filter, Plus, Minus, AlertTriangle, Package, TrendingUp, TrendingDown, Download } from "lucide-react";
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
const inventory = [
  {
    id: "INV-001",
    name: "Premium Air Filter",
    sku: "AF-YMT09-001",
    brand: "Yamaha",
    model: "MT-09",
    currentStock: 45,
    minStock: 10,
    maxStock: 100,
    reorderPoint: 15,
    cost: 15.99,
    lastRestocked: "2024-01-10",
    location: "A1-B2",
    supplier: "Yamaha Parts Co."
  },
  {
    id: "INV-002", 
    name: "Ceramic Brake Pads",
    sku: "BP-HCBR-002",
    brand: "Honda",
    model: "CBR600RR",
    currentStock: 8,
    minStock: 15,
    maxStock: 75,
    reorderPoint: 20,
    cost: 45.99,
    lastRestocked: "2024-01-05",
    location: "B3-C1",
    supplier: "Honda Direct"
  },
  {
    id: "INV-003",
    name: "LED Headlight Assembly", 
    sku: "HL-KN300-003",
    brand: "Kawasaki",
    model: "Ninja 300",
    currentStock: 12,
    minStock: 5,
    maxStock: 50,
    reorderPoint: 8,
    cost: 125.99,
    lastRestocked: "2024-01-12",
    location: "C2-D3",
    supplier: "Kawasaki Motors"
  },
  {
    id: "INV-004",
    name: "Performance Exhaust",
    sku: "EX-YR1-004", 
    brand: "Yamaha",
    model: "R1",
    currentStock: 3,
    minStock: 8,
    maxStock: 30,
    reorderPoint: 10,
    cost: 299.99,
    lastRestocked: "2023-12-28",
    location: "D1-E2",
    supplier: "Performance Plus"
  },
  {
    id: "INV-005",
    name: "Oil Filter Kit",
    sku: "OF-HCB750-005",
    brand: "Honda", 
    model: "CB750",
    currentStock: 67,
    minStock: 20,
    maxStock: 120,
    reorderPoint: 25,
    cost: 8.99,
    lastRestocked: "2024-01-08",
    location: "A3-B4",
    supplier: "Honda Direct"
  },
  {
    id: "INV-006",
    name: "Chain & Sprocket Set",
    sku: "CS-KZX10-006",
    brand: "Kawasaki",
    model: "ZX-10R", 
    currentStock: 5,
    minStock: 10,
    maxStock: 40,
    reorderPoint: 12,
    cost: 79.99,
    lastRestocked: "2024-01-03",
    location: "E1-F2",
    supplier: "Chain Masters"
  },
  {
    id: "INV-007",
    name: "Spark Plug Set",
    sku: "SP-YFZ09-007",
    brand: "Yamaha",
    model: "FZ-09",
    currentStock: 0,
    minStock: 15,
    maxStock: 90,
    reorderPoint: 20,
    cost: 23.99,
    lastRestocked: "2023-12-20",
    location: "B2-C3",
    supplier: "Yamaha Parts Co."
  },
  {
    id: "INV-008",
    name: "Mirror Set Carbon",
    sku: "MR-HCBR1000-008",
    brand: "Honda",
    model: "CBR1000RR",
    currentStock: 18,
    minStock: 12,
    maxStock: 60,
    reorderPoint: 15,
    cost: 45.99,
    lastRestocked: "2024-01-11",
    location: "F3-G1",
    supplier: "Carbon Works"
  }
];

export default function Inventory() {
  const getStockStatus = (current: number, min: number, reorderPoint: number) => {
    if (current === 0) {
      return <StatusBadge status="danger">Out of Stock</StatusBadge>;
    }
    if (current < min || current <= reorderPoint) {
      return <StatusBadge status="warning">Low Stock</StatusBadge>;
    }
    return <StatusBadge status="success">In Stock</StatusBadge>;
  };

  const getStockIcon = (current: number, min: number) => {
    if (current === 0) return <AlertTriangle className="w-4 h-4 text-red-500" />;
    if (current < min) return <TrendingDown className="w-4 h-4 text-yellow-500" />;
    return <TrendingUp className="w-4 h-4 text-green-500" />;
  };

  const lowStockCount = inventory.filter(item => item.currentStock <= item.reorderPoint).length;
  const outOfStockCount = inventory.filter(item => item.currentStock === 0).length;
  const totalValue = inventory.reduce((sum, item) => sum + (item.currentStock * item.cost), 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">
            Track and manage product stock levels.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Bulk Update
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{inventory.length}</p>
              </div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Low Stock Items</p>
                <p className="text-2xl font-bold text-yellow-600">{lowStockCount}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">{outOfStockCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
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
          <CardTitle>Inventory Management</CardTitle>
          <CardDescription>Monitor stock levels and manage inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by product name, SKU, or location..."
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Stock Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="in_stock">In Stock</SelectItem>
                  <SelectItem value="low_stock">Low Stock</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  <SelectItem value="yamaha">Yamaha</SelectItem>
                  <SelectItem value="honda">Honda</SelectItem>
                  <SelectItem value="kawasaki">Kawasaki</SelectItem>
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

      {/* Inventory Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Min/Max</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Last Restocked</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[140px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {getStockIcon(item.currentStock, item.minStock)}
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.sku} • {item.brand} {item.model}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-muted font-mono">
                        {item.location}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <span className="text-lg font-bold">{item.currentStock}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center text-sm text-muted-foreground">
                      {item.minStock} / {item.maxStock}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-right">
                      <p className="font-medium">${(item.currentStock * item.cost).toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">${item.cost} each</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{item.lastRestocked}</div>
                  </TableCell>
                  <TableCell>
                    {getStockStatus(item.currentStock, item.minStock, item.reorderPoint)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        Reorder
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