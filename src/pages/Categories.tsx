import React, { useState, useEffect } from "react";
import { Search, Filter, Plus, Edit, Trash2, Eye, Folder, Upload, GripVertical, ChevronRight, ChevronDown } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CategoryFormModal } from "@/components/CategoryFormModal";
import { useCategories, useCategoryAPI } from "@/hooks/useCategoryAPI";
import { toast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  level: number;
  categoryType?: string;
  sortOrder: number;
  isActive: boolean;
  isVisibleInMenu: boolean;
  icon?: string;
  bannerImage?: string;
  featuredOrder?: number;
  productCount: number;
  childrenCount: number;
  parent?: { id: string; name: string; slug: string };
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

export default function Categories() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [categoryTypeFilter, setCategoryTypeFilter] = useState("");
  const [parentFilter, setParentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [viewMode, setViewMode] = useState<'table' | 'tree'>('table');

  // API hooks
  const { data: categoriesData, isLoading, error, refetch } = useCategories({
    page: currentPage,
    limit: pageSize,
    search: searchQuery || undefined,
    level: levelFilter && levelFilter !== "all" ? levelFilter : undefined,
    categoryType: categoryTypeFilter && categoryTypeFilter !== "all" ? categoryTypeFilter : undefined,
    parentId: parentFilter && parentFilter !== "all" ? parentFilter : undefined,
    isActive: statusFilter && statusFilter !== "all" ? statusFilter === "active" : undefined,
  });

  const { deleteCategory, reorderCategories, bulkUpdateCategories } = useCategoryAPI();

  const categories = categoriesData?.data?.categories || [];
  const pagination = categoriesData?.data?.pagination;

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== undefined) {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Listen for modal open events from sidebar
  useEffect(() => {
    const handleOpenModal = () => {
      setIsModalOpen(true);
    };

    window.addEventListener('open-category-modal', handleOpenModal);
    return () => window.removeEventListener('open-category-modal', handleOpenModal);
  }, []);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCategories(categories.map(c => c.id));
    } else {
      setSelectedCategories([]);
    }
  };

  const handleSelectCategory = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories(prev => [...prev, categoryId]);
    } else {
      setSelectedCategories(prev => prev.filter(id => id !== categoryId));
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(categoryId);
        toast({
          title: "Success",
          description: "Category deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete category",
          variant: "destructive",
        });
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCategories.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedCategories.length} categories?`)) {
      try {
        await Promise.all(selectedCategories.map(id => deleteCategory(id)));
        setSelectedCategories([]);
        toast({
          title: "Success",
          description: `${selectedCategories.length} categories deleted successfully`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete categories",
          variant: "destructive",
        });
      }
    }
  };

  const handleBulkUpdate = async (updates: Partial<Category>) => {
    if (selectedCategories.length === 0) return;
    
    try {
      await bulkUpdateCategories(selectedCategories, updates);
      setSelectedCategories([]);
      toast({
        title: "Success",
        description: `${selectedCategories.length} categories updated successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update categories",
        variant: "destructive",
      });
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleModalSuccess = () => {
    refetch();
  };

  const toggleExpanded = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const getStatusBadge = (category: Category) => {
    if (!category.isActive) {
      return <StatusBadge status="danger">Inactive</StatusBadge>;
    }
    if (!category.isVisibleInMenu) {
      return <StatusBadge status="warning">Hidden</StatusBadge>;
    }
    return <StatusBadge status="success">Active</StatusBadge>;
  };

  const getLevelIndent = (level: number) => {
    return level * 20; // 20px per level
  };

  const renderCategoryRow = (category: Category, isChild = false) => {
    const isExpanded = expandedCategories.has(category.id);
    const hasChildren = category.childrenCount > 0;

    return (
      <TableRow key={category.id} className={isChild ? "bg-muted/30" : ""}>
        <TableCell style={{ paddingLeft: `${getLevelIndent(category.level)}px` }}>
          <div className="flex items-center gap-2">
            {hasChildren && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => toggleExpanded(category.id)}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            )}
            {!hasChildren && <div className="w-6" />}
            <Checkbox
              checked={selectedCategories.includes(category.id)}
              onCheckedChange={(checked) => handleSelectCategory(category.id, checked as boolean)}
            />
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
              {category.icon ? (
                <img 
                  src={category.icon} 
                  alt={category.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Folder className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="font-medium">{category.name}</p>
              <p className="text-sm text-muted-foreground">/{category.slug}</p>
            </div>
          </div>
        </TableCell>
        <TableCell>
          {category.parent ? (
            <Badge variant="outline">{category.parent.name}</Badge>
          ) : (
            <span className="text-muted-foreground">Root</span>
          )}
        </TableCell>
        <TableCell>
          <div className="flex gap-2">
            <Badge variant="secondary">Level {category.level}</Badge>
            {category.categoryType && (
              <Badge variant="outline">{category.categoryType}</Badge>
            )}
          </div>
        </TableCell>
        <TableCell>
          <div className="flex gap-2">
            <Badge variant="outline">{category.productCount} products</Badge>
            {category.childrenCount > 0 && (
              <Badge variant="secondary">{category.childrenCount} subcategories</Badge>
            )}
          </div>
        </TableCell>
        <TableCell>
          {getStatusBadge(category)}
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleEditCategory(category)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleDeleteCategory(category.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">Failed to load categories</p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <p className="text-muted-foreground">
            Organize your products into categories and subcategories with tree structure.
        </p>
      </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => setViewMode(viewMode === 'table' ? 'tree' : 'table')}
          >
            {viewMode === 'table' ? <Folder className="w-4 h-4" /> : <GripVertical className="w-4 h-4" />}
            {viewMode === 'table' ? 'Tree View' : 'Table View'}
          </Button>
          <Button 
            className="gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Add Category
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Category Management</CardTitle>
          <CardDescription>Search, filter, and manage your category hierarchy</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search categories by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="1">Level 1</SelectItem>
                  <SelectItem value="2">Level 2</SelectItem>
                  <SelectItem value="3">Level 3</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryTypeFilter} onValueChange={setCategoryTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="main">Main</SelectItem>
                  <SelectItem value="sub">Sub</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                More Filters
              </Button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedCategories.length > 0 && (
            <div className="flex items-center gap-2 pt-4 border-t mt-4">
              <p className="text-sm text-muted-foreground">
                {selectedCategories.length} category(ies) selected
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleBulkUpdate({ isActive: true })}
              >
                Activate
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleBulkUpdate({ isActive: false })}
              >
                Deactivate
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleBulkUpdate({ isVisibleInMenu: true })}
              >
                Show in Menu
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleBulkUpdate({ isVisibleInMenu: false })}
              >
                Hide from Menu
              </Button>
              <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                Delete Selected
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading categories...</p>
              </div>
            </div>
          ) : categories.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Folder className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No categories found</p>
                <Button 
                  className="mt-4"
                  onClick={() => setIsModalOpen(true)}
                >
                  Add Your First Category
                </Button>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedCategories.length === categories.length && categories.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>Type & Level</TableHead>
                  <TableHead>Counts</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <React.Fragment key={category.id}>
                    {renderCategoryRow(category)}
                    {expandedCategories.has(category.id) && category.children?.map(child => 
                      <React.Fragment key={child.id}>
                        {renderCategoryRow(child, true)}
                      </React.Fragment>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{" "}
            {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{" "}
            {pagination.totalItems} categories
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.currentPage === 1}
              onClick={() => setCurrentPage(pagination.currentPage - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => setCurrentPage(pagination.currentPage + 1)}
            >
              Next
            </Button>
      </div>
        </div>
      )}

      {/* Category Form Modal */}
      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        category={editingCategory}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}