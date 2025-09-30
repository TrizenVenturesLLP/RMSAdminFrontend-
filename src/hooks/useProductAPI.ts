import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://rmsadminbackend.llp.trizenventures.com/api/v1';

// Types
interface Product {
  id: string;
  name: string;
  slug: string;
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
  attributes?: Record<string, string | number | boolean>;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  brand?: {
    id: string;
    name: string;
    slug: string;
    logo?: string;
  };
  images?: Array<{
    id: string;
    url: string;
    altText?: string;
    isPrimary: boolean;
    sortOrder: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface CreateProductData {
  name: string;
  description?: string;
  shortDescription?: string;
  sku: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  stockQuantity: number;
  lowStockThreshold?: number;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  categoryId: string;
  brandId: string;
  isActive?: boolean;
  isDigital?: boolean;
  isFeatured?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  tags?: string[];
  attributes?: Record<string, string | number | boolean>;
}

interface UpdateProductData {
  name?: string;
  description?: string;
  shortDescription?: string;
  sku?: string;
  price?: number;
  comparePrice?: number;
  costPrice?: number;
  stockQuantity?: number;
  lowStockThreshold?: number;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  categoryId?: string;
  brandId?: string;
  isActive?: boolean;
  isDigital?: boolean;
  isFeatured?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  tags?: string[];
  attributes?: Record<string, string | number | boolean>;
}

interface ProductsResponse {
  success: boolean;
  data: {
    products: Product[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

interface ProductResponse {
  success: boolean;
  data: {
    product: Product;
  };
}

// API Functions
const fetchProducts = async (params: {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  featured?: boolean;
  search?: string;
} = {}): Promise<ProductsResponse> => {
  // Mock data for testing when backend is not available
  const mockProducts: Product[] = [
    {
      id: "prod-1",
      name: "Yamaha MT-09 Air Filter",
      slug: "yamaha-mt-09-air-filter",
      description: "High-performance air filter for Yamaha MT-09",
      shortDescription: "Premium air filter",
      sku: "YAM-AF-001",
      price: 45.99,
      comparePrice: 59.99,
      costPrice: 25.00,
      stockQuantity: 25,
      lowStockThreshold: 10,
      weight: 0.5,
      dimensions: { length: 15, width: 10, height: 5 },
      categoryId: "cat-1",
      brandId: "brand-1",
      isActive: true,
      isDigital: false,
      isFeatured: false,
      tags: ["air-filter", "yamaha", "mt-09"],
      category: { id: "cat-1", name: "Engine Parts", slug: "engine-parts" },
      brand: { id: "brand-1", name: "Yamaha", slug: "yamaha", logo: "" },
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "prod-2",
      name: "Honda CBR600RR Brake Pads",
      slug: "honda-cbr600rr-brake-pads",
      description: "High-performance brake pads for Honda CBR600RR",
      shortDescription: "Premium brake pads",
      sku: "HON-BP-002",
      price: 89.99,
      comparePrice: 119.99,
      costPrice: 45.00,
      stockQuantity: 15,
      lowStockThreshold: 10,
      weight: 0.8,
      dimensions: { length: 12, width: 8, height: 3 },
      categoryId: "cat-2",
      brandId: "brand-2",
      isActive: true,
      isDigital: false,
      isFeatured: false,
      tags: ["brake-pads", "honda", "cbr600rr"],
      category: { id: "cat-2", name: "Brake System", slug: "brake-system" },
      brand: { id: "brand-2", name: "Honda", slug: "honda", logo: "" },
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  try {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_BASE_URL}/products?${searchParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Backend not available');
    }

    return response.json();
  } catch (error) {
    console.warn('Backend not available, using mock products:', error);
    
    // Apply basic filtering to mock data
    let filteredProducts = mockProducts;
    
    if (params.search) {
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(params.search!.toLowerCase()) ||
        p.sku.toLowerCase().includes(params.search!.toLowerCase())
      );
    }
    
    if (params.category && params.category !== "all") {
      filteredProducts = filteredProducts.filter(p => p.categoryId === params.category);
    }
    
    if (params.brand && params.brand !== "all") {
      filteredProducts = filteredProducts.filter(p => p.brandId === params.brand);
    }

    return {
      success: true,
      data: {
        products: filteredProducts,
        pagination: {
          currentPage: params.page || 1,
          totalPages: 1,
          totalItems: filteredProducts.length,
          itemsPerPage: params.limit || 20,
        },
      },
    };
  }
};

const fetchProduct = async (id: string): Promise<ProductResponse> => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch product');
  }

  return response.json();
};

const createProductAPI = async (data: CreateProductData): Promise<Product> => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    // Handle validation errors with specific field details
    if (response.status === 400 && errorData.errors) {
      const fieldErrors = errorData.errors.map((error: { field: string; message: string }) => 
        `${error.field}: ${error.message}`
      ).join(', ');
      throw new Error(`Validation failed: ${fieldErrors}`);
    }
    
    throw new Error(errorData.message || 'Failed to create product');
  }

  const result = await response.json();
  return result.data.product;
};

const updateProductAPI = async ({ id, data }: { id: string; data: UpdateProductData }): Promise<Product> => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    // Handle validation errors with specific field details
    if (response.status === 400 && errorData.errors) {
      const fieldErrors = errorData.errors.map((error: { field: string; message: string }) => 
        `${error.field}: ${error.message}`
      ).join(', ');
      throw new Error(`Validation failed: ${fieldErrors}`);
    }
    
    throw new Error(errorData.message || 'Failed to update product');
  }

  const result = await response.json();
  return result.data.product;
};

const deleteProductAPI = async (id: string): Promise<void> => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete product');
  }
};

const uploadProductImagesAPI = async (productId: string, files: File[]): Promise<void> => {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  
  files.forEach(file => {
    formData.append('images', file);
  });

  const response = await fetch(`${API_BASE_URL}/products/${productId}/images`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to upload images');
  }
};

// React Query Hooks
export const useProducts = (params: Parameters<typeof fetchProducts>[0] = {}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => fetchProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProductAPI = () => {
  const queryClient = useQueryClient();

  const createProductMutation = useMutation({
    mutationFn: createProductAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Success',
        description: 'Product created successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: updateProductAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Success',
        description: 'Product updated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteProductAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Success',
        description: 'Product deleted successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const uploadImagesMutation = useMutation({
    mutationFn: ({ productId, files }: { productId: string; files: File[] }) =>
      uploadProductImagesAPI(productId, files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Success',
        description: 'Images uploaded successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    createProduct: createProductMutation.mutateAsync,
    updateProduct: updateProductMutation.mutateAsync,
    deleteProduct: deleteProductMutation.mutateAsync,
    uploadProductImages: uploadImagesMutation.mutateAsync,
    isCreating: createProductMutation.isPending,
    isUpdating: updateProductMutation.isPending,
    isDeleting: deleteProductMutation.isPending,
    isUploading: uploadImagesMutation.isPending,
  };
};
