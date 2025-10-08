import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

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

interface CategoriesResponse {
  success: boolean;
  data: {
    categories: Category[];
    pagination?: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

interface CategoryTreeResponse {
  success: boolean;
  data: {
    tree: Category[];
    totalCategories: number;
  };
}

interface CreateCategoryData {
  name: string;
  description?: string;
  parentId?: string;
  categoryType?: string;
  sortOrder?: number;
  isActive?: boolean;
  isVisibleInMenu?: boolean;
  icon?: string;
  bannerImage?: string;
  featuredOrder?: number;
  metaTitle?: string;
  metaDescription?: string;
}

interface UpdateCategoryData extends Partial<CreateCategoryData> {
  id: string;
}

interface CategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
  level?: string;
  categoryType?: string;
  parentId?: string;
  isActive?: boolean;
  isVisibleInMenu?: boolean;
  sortBy?: string;
  sortOrder?: string;
}

const fetchCategories = async (params: CategoriesParams = {}): Promise<CategoriesResponse> => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value.toString());
    }
  });

  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/categories/admin?${searchParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }

  return response.json();
};

const fetchCategoryTree = async (): Promise<CategoryTreeResponse> => {
  const response = await fetch(`${API_BASE_URL}/categories/tree`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch category tree');
  }

  return response.json();
};

const createCategory = async (data: CreateCategoryData): Promise<{ success: boolean; data: { category: Category } }> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create category');
  }

  return response.json();
};

const updateCategory = async (data: UpdateCategoryData): Promise<{ success: boolean; data: { category: Category } }> => {
  const { id, ...updateData } = data;
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update category');
  }

  return response.json();
};

const deleteCategory = async (id: string): Promise<{ success: boolean; message: string }> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete category');
  }

  return response.json();
};

const reorderCategories = async (categories: Array<{ id: string; sortOrder: number; parentId?: string }>): Promise<{ success: boolean; message: string }> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/categories/reorder`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ categories }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to reorder categories');
  }

  return response.json();
};

const bulkUpdateCategories = async (categoryIds: string[], updates: Partial<Category>): Promise<{ success: boolean; message: string }> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/categories/bulk-update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ categoryIds, updates }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to bulk update categories');
  }

  return response.json();
};

export const useCategories = (params: CategoriesParams = {}) => {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => fetchCategories(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useCategoryTree = () => {
  return useQuery({
    queryKey: ['categoryTree'],
    queryFn: fetchCategoryTree,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};

export const useCategoryAPI = () => {
  const queryClient = useQueryClient();

  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categoryTree'] });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categoryTree'] });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categoryTree'] });
    },
  });

  const reorderCategoriesMutation = useMutation({
    mutationFn: reorderCategories,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categoryTree'] });
    },
  });

  const bulkUpdateCategoriesMutation = useMutation({
    mutationFn: bulkUpdateCategories,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categoryTree'] });
    },
  });

  return {
    createCategory: createCategoryMutation.mutateAsync,
    updateCategory: updateCategoryMutation.mutateAsync,
    deleteCategory: deleteCategoryMutation.mutateAsync,
    reorderCategories: reorderCategoriesMutation.mutateAsync,
    bulkUpdateCategories: bulkUpdateCategoriesMutation.mutateAsync,
    isCreating: createCategoryMutation.isPending,
    isUpdating: updateCategoryMutation.isPending,
    isDeleting: deleteCategoryMutation.isPending,
    isReordering: reorderCategoriesMutation.isPending,
    isBulkUpdating: bulkUpdateCategoriesMutation.isPending,
  };
};

