import { useQuery } from '@tanstack/react-query';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  sortOrder: number;
  isActive: boolean;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

interface CategoriesResponse {
  success: boolean;
  data: {
    categories: Category[];
  };
}

const fetchCategories = async (): Promise<Category[]> => {
  // Mock data for testing when backend is not available
  const mockCategories: Category[] = [
    {
      id: "cat-1",
      name: "Engine Parts",
      slug: "engine-parts",
      description: "Motorcycle engine components",
      isActive: true,
      sortOrder: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "cat-2", 
      name: "Brake System",
      slug: "brake-system",
      description: "Brake pads, discs, and components",
      isActive: true,
      sortOrder: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "cat-3",
      name: "Drive Train",
      slug: "drive-train", 
      description: "Chains, sprockets, and transmission parts",
      isActive: true,
      sortOrder: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "cat-4",
      name: "Exhaust System",
      slug: "exhaust-system",
      description: "Exhaust pipes and mufflers",
      isActive: true,
      sortOrder: 4,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "cat-5",
      name: "Accessories",
      slug: "accessories",
      description: "Motorcycle accessories and add-ons",
      isActive: true,
      sortOrder: 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Backend not available');
    }

    const result: CategoriesResponse = await response.json();
    return result.data.categories.filter(category => category.isActive);
  } catch (error) {
    console.warn('Backend not available, using mock categories:', error);
    return mockCategories;
  }
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};
