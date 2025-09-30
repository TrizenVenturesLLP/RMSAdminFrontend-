import { Plus, Edit, Trash2, Building2, Bike, ChevronDown, ChevronRight } from "lucide-react";
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

// Mock data
const brands = [
  {
    id: "BRAND-001",
    name: "Yamaha",
    country: "Japan",
    founded: 1955,
    status: "active",
    productCount: 234,
    models: [
      { name: "MT-09", year: "2023", type: "Naked", products: 45 },
      { name: "R1", year: "2023", type: "Sport", products: 38 },
      { name: "FZ-09", year: "2022", type: "Naked", products: 32 },
      { name: "YZF-R6", year: "2023", type: "Sport", products: 28 },
      { name: "MT-07", year: "2023", type: "Naked", products: 41 }
    ]
  },
  {
    id: "BRAND-002",
    name: "Honda",
    country: "Japan", 
    founded: 1948,
    status: "active",
    productCount: 198,
    models: [
      { name: "CBR600RR", year: "2023", type: "Sport", products: 42 },
      { name: "CB750", year: "2022", type: "Standard", products: 35 },
      { name: "CBR1000RR", year: "2023", type: "Sport", products: 39 },
      { name: "CB500F", year: "2023", type: "Naked", products: 28 },
      { name: "CRF450L", year: "2023", type: "Dual Sport", products: 24 }
    ]
  },
  {
    id: "BRAND-003",
    name: "Kawasaki",
    country: "Japan",
    founded: 1896,
    status: "active", 
    productCount: 167,
    models: [
      { name: "Ninja 300", year: "2023", type: "Sport", products: 33 },
      { name: "ZX-10R", year: "2023", type: "Sport", products: 41 },
      { name: "Z900", year: "2023", type: "Naked", products: 29 },
      { name: "Ninja 650", year: "2022", type: "Sport", products: 31 },
      { name: "Versys 650", year: "2023", type: "Adventure", products: 19 }
    ]
  },
  {
    id: "BRAND-004",
    name: "Suzuki",
    country: "Japan",
    founded: 1909,
    status: "active",
    productCount: 142,
    models: [
      { name: "GSX-R1000", year: "2023", type: "Sport", products: 36 },
      { name: "SV650", year: "2022", type: "Sport Touring", products: 28 },
      { name: "GSX-R600", year: "2023", type: "Sport", products: 31 },
      { name: "V-Strom 650", year: "2023", type: "Adventure", products: 22 },
      { name: "Hayabusa", year: "2023", type: "Sport", products: 25 }
    ]
  },
  {
    id: "BRAND-005",
    name: "Ducati",
    country: "Italy",
    founded: 1926,
    status: "active",
    productCount: 89,
    models: [
      { name: "Panigale V4", year: "2023", type: "Sport", products: 22 },
      { name: "Monster 821", year: "2022", type: "Naked", products: 18 },
      { name: "Multistrada V4", year: "2023", type: "Adventure", products: 16 },
      { name: "Diavel 1260", year: "2023", type: "Cruiser", products: 15 },
      { name: "Scrambler Icon", year: "2022", type: "Scrambler", products: 18 }
    ]
  },
  {
    id: "BRAND-006",
    name: "BMW",
    country: "Germany",
    founded: 1916,
    status: "active",
    productCount: 76,
    models: [
      { name: "R1250GS", year: "2023", type: "Adventure", products: 19 },
      { name: "S1000RR", year: "2023", type: "Sport", products: 17 },
      { name: "F850GS", year: "2022", type: "Adventure", products: 15 },
      { name: "R nineT", year: "2023", type: "Heritage", products: 13 },
      { name: "C650GT", year: "2022", type: "Scooter", products: 12 }
    ]
  }
];

export default function Brands() {
  const [expandedBrands, setExpandedBrands] = useState<string[]>([]);

  const toggleBrand = (brandId: string) => {
    setExpandedBrands(prev => 
      prev.includes(brandId) 
        ? prev.filter(id => id !== brandId)
        : [...prev, brandId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Brands & Models</h1>
          <p className="text-muted-foreground">
            Manage motorcycle brands and their models.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Model
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Brand
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Brands</p>
                <p className="text-2xl font-bold">{brands.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Models</p>
                <p className="text-2xl font-bold">{brands.reduce((sum, b) => sum + b.models.length, 0)}</p>
              </div>
              <Bike className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">{brands.reduce((sum, b) => sum + b.productCount, 0)}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Japanese Brands</p>
                <p className="text-2xl font-bold">{brands.filter(b => b.country === "Japan").length}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-green-600"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Brands and Models */}
      <Card>
        <CardHeader>
          <CardTitle>Brands & Models Management</CardTitle>
          <CardDescription>Manage motorcycle brands and their available models</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-2">
            {brands.map((brand) => (
              <Collapsible key={brand.id} open={expandedBrands.includes(brand.id)}>
                <div className="border-b last:border-b-0">
                  {/* Brand Row */}
                  <div className="flex items-center justify-between p-4 hover:bg-muted/50">
                    <div className="flex items-center gap-4 flex-1">
                      <CollapsibleTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="p-0 h-auto"
                          onClick={() => toggleBrand(brand.id)}
                        >
                          {expandedBrands.includes(brand.id) ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                      
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-primary" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="font-semibold text-lg">{brand.name}</p>
                            <p className="text-sm text-muted-foreground">{brand.country} • Founded {brand.founded}</p>
                          </div>
                          <div className="flex gap-4 text-sm">
                            <span className="text-muted-foreground">{brand.models.length} models</span>
                            <span className="text-muted-foreground">{brand.productCount} products</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <StatusBadge status="success">Active</StatusBadge>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Models Table */}
                  <CollapsibleContent>
                    <div className="bg-muted/30 px-4 pb-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-8"></TableHead>
                            <TableHead>Model Name</TableHead>
                            <TableHead>Year</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Products</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {brand.models.map((model, index) => (
                            <TableRow key={index}>
                              <TableCell></TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Bike className="w-4 h-4 text-muted-foreground" />
                                  <span className="font-medium">{model.name}</span>
                                </div>
                              </TableCell>
                              <TableCell>{model.year}</TableCell>
                              <TableCell>
                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-background border">
                                  {model.type}
                                </span>
                              </TableCell>
                              <TableCell>{model.products}</TableCell>
                              <TableCell>
                                <div className="flex gap-1">
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
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}