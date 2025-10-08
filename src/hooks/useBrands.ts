import { useQuery } from '@tanstack/react-query';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  website?: string;
  country?: string;
  foundedYear?: number;
  isActive: boolean;
  sortOrder: number;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

interface BrandsResponse {
  success: boolean;
  data: {
    brands: Brand[];
  };
}

const fetchBrands = async (): Promise<Brand[]> => {
  // Mock data for testing when backend is not available
  const mockBrands: Brand[] = [
    {
      id: "brand-1",
      name: "Yamaha",
      slug: "yamaha",
      description: "Japanese motorcycle manufacturer",
      isActive: true,
      sortOrder: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "brand-2",
      name: "Honda",
      slug: "honda", 
      description: "Japanese motorcycle manufacturer",
      isActive: true,
      sortOrder: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "brand-3",
      name: "Kawasaki",
      slug: "kawasaki",
      description: "Japanese motorcycle manufacturer", 
      isActive: true,
      sortOrder: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "brand-4",
      name: "Suzuki",
      slug: "suzuki",
      description: "Japanese motorcycle manufacturer",
      isActive: true,
      sortOrder: 4,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "brand-5",
      name: "Ducati",
      slug: "ducati",
      description: "Italian motorcycle manufacturer",
      isActive: true,
      sortOrder: 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  try {
    const response = await fetch(`${API_BASE_URL}/brands`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Backend not available');
    }

    const result: BrandsResponse = await response.json();
    return result.data.brands.filter(brand => brand.isActive);
  } catch (error) {
    console.warn('Backend not available, using mock brands:', error);
    return mockBrands;
  }
};

export const useBrands = () => {
  return useQuery({
    queryKey: ['brands'],
    queryFn: fetchBrands,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};
