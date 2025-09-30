import { Upload, Search, Filter, Grid3X3, List, Eye, Edit, Trash2, Download, Image, FileText, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

// Mock data
const mediaFiles = [
  {
    id: "MEDIA-001",
    name: "yamaha-mt09-air-filter.jpg",
    type: "image",
    size: "2.4 MB",
    dimensions: "1920x1080",
    uploadDate: "2024-01-15",
    category: "Products",
    usedIn: ["Product: Premium Air Filter", "Category: Engine Parts"],
    url: "/placeholder.svg"
  },
  {
    id: "MEDIA-002",
    name: "honda-cbr-brake-pads.jpg", 
    type: "image",
    size: "1.8 MB",
    dimensions: "1280x720",
    uploadDate: "2024-01-14",
    category: "Products",
    usedIn: ["Product: Ceramic Brake Pads"],
    url: "/placeholder.svg"
  },
  {
    id: "MEDIA-003",
    name: "kawasaki-ninja-headlight.jpg",
    type: "image", 
    size: "3.1 MB",
    dimensions: "2048x1152",
    uploadDate: "2024-01-13",
    category: "Products",
    usedIn: ["Product: LED Headlight Assembly"],
    url: "/placeholder.svg"
  },
  {
    id: "MEDIA-004",
    name: "winter-sale-banner.jpg",
    type: "image",
    size: "5.2 MB", 
    dimensions: "1920x480",
    uploadDate: "2024-01-12",
    category: "Marketing",
    usedIn: ["Campaign: Winter Sale 2024"],
    url: "/placeholder.svg"
  },
  {
    id: "MEDIA-005",
    name: "product-installation-guide.pdf",
    type: "document",
    size: "15.7 MB",
    dimensions: "A4",
    uploadDate: "2024-01-11", 
    category: "Documentation",
    usedIn: ["Support: Installation Guides"],
    url: "/placeholder.svg"
  },
  {
    id: "MEDIA-006",
    name: "motorcycle-parts-catalog.pdf",
    type: "document",
    size: "28.3 MB",
    dimensions: "A4",
    uploadDate: "2024-01-10",
    category: "Documentation",
    usedIn: ["Marketing: Catalog 2024"],
    url: "/placeholder.svg"
  },
  {
    id: "MEDIA-007",
    name: "exhaust-sound-demo.mp4",
    type: "video",
    size: "45.6 MB",
    dimensions: "1920x1080",
    uploadDate: "2024-01-09",
    category: "Products",
    usedIn: ["Product: Performance Exhaust"],
    url: "/placeholder.svg"
  },
  {
    id: "MEDIA-008",
    name: "brand-logo-yamaha.svg",
    type: "image",
    size: "0.3 MB",
    dimensions: "500x200",
    uploadDate: "2024-01-08",
    category: "Brands",
    usedIn: ["Brand: Yamaha", "Multiple Products"],
    url: "/placeholder.svg"
  }
];

export default function Media() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image className="w-5 h-5 text-blue-500" />;
      case "video": 
        return <Video className="w-5 h-5 text-purple-500" />;
      case "document":
        return <FileText className="w-5 h-5 text-green-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "image":
        return <StatusBadge status="info">Image</StatusBadge>;
      case "video":
        return <StatusBadge status="warning">Video</StatusBadge>;
      case "document":
        return <StatusBadge status="success">Document</StatusBadge>;
      default:
        return <StatusBadge status="pending">{type}</StatusBadge>;
    }
  };

  const totalFiles = mediaFiles.length;
  const totalSize = mediaFiles.reduce((sum, file) => {
    const size = parseFloat(file.size.split(' ')[0]);
    return sum + size;
  }, 0);
  const imageCount = mediaFiles.filter(f => f.type === "image").length;
  const documentCount = mediaFiles.filter(f => f.type === "document").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Media Library</h1>
          <p className="text-muted-foreground">
            Upload and manage product images and marketing assets.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Bulk Download
          </Button>
          <Button className="gap-2">
            <Upload className="w-4 h-4" />
            Upload Files
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Files</p>
                <p className="text-2xl font-bold">{totalFiles}</p>
              </div>
              <Image className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Size</p>
                <p className="text-2xl font-bold">{totalSize.toFixed(1)} MB</p>
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
                <p className="text-sm font-medium text-muted-foreground">Images</p>
                <p className="text-2xl font-bold">{imageCount}</p>
              </div>
              <Image className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Documents</p>
                <p className="text-2xl font-bold">{documentCount}</p>
              </div>
              <FileText className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Media Management</CardTitle>
          <CardDescription>Search and organize your media files</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by filename or category..."
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters and View Toggle */}
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="File Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="image">Images</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                  <SelectItem value="document">Documents</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="products">Products</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="documentation">Documentation</SelectItem>
                  <SelectItem value="brands">Brands</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                More Filters
              </Button>

              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media Files */}
      <Card>
        <CardContent className="p-6">
          {viewMode === "grid" ? (
            /* Grid View */
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {mediaFiles.map((file) => (
                <div key={file.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                    {file.type === "image" ? (
                      <Image className="w-12 h-12 text-muted-foreground" />
                    ) : (
                      getFileIcon(file.type)
                    )}
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-sm truncate" title={file.name}>
                      {file.name}
                    </p>
                    <div className="flex justify-between items-center">
                      {getTypeBadge(file.type)}
                      <span className="text-xs text-muted-foreground">{file.size}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{file.uploadDate}</p>
                    <div className="flex gap-1 pt-2">
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
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-2">
              {mediaFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                  <div className="flex items-center gap-3 flex-1">
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{file.size}</span>
                        <span>{file.dimensions}</span>
                        <span>{file.uploadDate}</span>
                        <span>{file.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTypeBadge(file.type)}
                      <span className="text-sm text-muted-foreground">
                        Used in {file.usedIn.length} places
                      </span>
                    </div>
                  </div>
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
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}