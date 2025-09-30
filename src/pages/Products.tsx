import { useState, useEffect } from "react";
import { Search, Filter, Plus, Edit, Trash2, Eye, Package, Upload } from "lucide-react";
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
import { ProductFormModal } from "@/components/ProductFormModal";
import { BulkUploadModal } from "@/components/BulkUploadModal";
import { useProducts, useProductAPI } from "@/hooks/useProductAPI";
import { useCategories } from "@/hooks/useCategories";
import { useBrands } from "@/hooks/useBrands";
import { toast } from "@/hooks/use-toast";

export default function Products() {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<{
    id: string;
    name: string;
    description?: string;
    shortDescription?: string;
    sku: string;
    price: number;
    comparePrice?: number;
    costPrice?: number;
    stockQuantity: number;
    lowStockThreshold: number;
    weight?: number;
    dimensions?: {
      length?: number;
      width?: number;
      height?: number;
    };
    categoryId: string;
    brandId: string;
    isActive: boolean;
    isDigital: boolean;
    isFeatured: boolean;
    metaTitle?: string;
    metaDescription?: string;
    tags?: string[];
    brand?: { id: string; name: string; };
    category?: { id: string; name: string; };
    images?: Array<{ id: string; url: string; }>;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // API hooks
  const { data: productsData, isLoading, error, refetch } = useProducts({
    page: currentPage,
    limit: pageSize,
    search: searchQuery || undefined,
    brand: brandFilter && brandFilter !== "all" ? brandFilter : undefined,
    category: categoryFilter && categoryFilter !== "all" ? categoryFilter : undefined,
  });

  const { deleteProduct } = useProductAPI();
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();

  const products = productsData?.data?.products || [];
  const pagination = productsData?.data?.pagination;

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

    window.addEventListener('open-product-modal', handleOpenModal);
    return () => window.removeEventListener('open-product-modal', handleOpenModal);
  }, []);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(products.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  };

  const handleEditProduct = (product: typeof products[0]) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId);
      } catch (error) {
        // Error is handled by the hook
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
      try {
        await Promise.all(selectedProducts.map(id => deleteProduct(id)));
        setSelectedProducts([]);
      } catch (error) {
        // Error is handled by the hook
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleModalSuccess = () => {
    refetch();
  };

  const getStatusBadge = (product: typeof products[0]) => {
    if (!product.isActive) {
      return <StatusBadge status="danger">Inactive</StatusBadge>;
    }
    if (Number(product.stockQuantity || 0) === 0) {
      return <StatusBadge status="danger">Out of Stock</StatusBadge>;
    }
    if (Number(product.stockQuantity || 0) <= Number(product.lowStockThreshold || 0)) {
      return <StatusBadge status="warning">Low Stock</StatusBadge>;
    }
    return <StatusBadge status="success">In Stock</StatusBadge>;
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">Failed to load products</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your motorcycle parts and accessories inventory.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => setIsBulkUploadOpen(true)}
          >
            <Upload className="w-4 h-4" />
            Bulk Upload
          </Button>
          <Button 
            className="gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Product Management</CardTitle>
          <CardDescription>Search, filter, and manage your product catalog</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search products by name, brand, or model..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <Select value={brandFilter} onValueChange={setBrandFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  {brands?.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                More Filters
              </Button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedProducts.length > 0 && (
            <div className="flex items-center gap-2 pt-4 border-t mt-4">
              <p className="text-sm text-muted-foreground">
                {selectedProducts.length} product(s) selected
              </p>
              <Button variant="outline" size="sm">
                Bulk Edit
              </Button>
              <Button variant="outline" size="sm">
                Update Stock
              </Button>
              <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                Delete Selected
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No products found</p>
                <Button 
                  className="mt-4"
                  onClick={() => setIsModalOpen(true)}
                >
                  Add Your First Product
                </Button>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedProducts.length === products.length && products.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={(checked) => handleSelectProduct(product.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          {product.images && product.images.length > 0 ? (
                            <img 
                              src={product.images[0].url} 
                              alt={product.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Package className="w-6 h-6 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.brand?.name || 'N/A'}</TableCell>
                    <TableCell>{product.category?.name || 'N/A'}</TableCell>
                    <TableCell className="font-medium">
                      ${Number(product.price || 0).toFixed(2)}
                      {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
                        <span className="text-sm text-muted-foreground line-through ml-2">
                          ${Number(product.comparePrice).toFixed(2)}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{Number(product.stockQuantity || 0)}</TableCell>
                    <TableCell>
                      {getStatusBadge(product)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
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
            {pagination.totalItems} products
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

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        product={editingProduct}
        onSuccess={handleModalSuccess}
      />

      {/* Bulk Upload Modal */}
      <BulkUploadModal
        isOpen={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}