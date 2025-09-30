import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Upload, Image as ImageIcon, Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useProductAPI } from "@/hooks/useProductAPI";
import { useCategories } from "@/hooks/useCategories";
import { useBrands } from "@/hooks/useBrands";

// Form validation schema
const productSchema = z.object({
  name: z.string().min(1, "Product name is required").max(200, "Name too long"),
  description: z.string().optional(),
  shortDescription: z.string().max(500, "Short description too long").optional(),
  sku: z.string().min(1, "SKU is required").max(50, "SKU too long"),
  price: z.number().min(0, "Price must be positive"),
  comparePrice: z.number().min(0, "Compare price must be positive").optional(),
  costPrice: z.number().min(0, "Cost price must be positive").optional(),
  stockQuantity: z.number().int().min(0, "Stock must be non-negative"),
  lowStockThreshold: z.number().int().min(0, "Low stock threshold must be non-negative").optional(),
  weight: z.number().min(0, "Weight must be positive").optional(),
  dimensions: z.object({
    length: z.number().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
  }).optional(),
  categoryId: z.string().optional(),
  brandId: z.string().optional(),
  isActive: z.boolean().default(true),
  isDigital: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  metaTitle: z.string().max(60, "Meta title too long").optional(),
  metaDescription: z.string().max(160, "Meta description too long").optional(),
  tags: z.array(z.string()).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: {
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
  };
  onSuccess?: () => void;
}

export function ProductFormModal({ isOpen, onClose, product, onSuccess }: ProductFormModalProps) {
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createProduct, updateProduct, uploadProductImages } = useProductAPI();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: brands, isLoading: brandsLoading } = useBrands();

  const isEditing = !!product;

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      shortDescription: "",
      sku: "",
      price: 0,
      comparePrice: undefined,
      costPrice: undefined,
      stockQuantity: 0,
      lowStockThreshold: 10,
      weight: undefined,
      dimensions: {
        length: undefined,
        width: undefined,
        height: undefined,
      },
      categoryId: "",
      brandId: "",
      isActive: true,
      isDigital: false,
      isFeatured: false,
      metaTitle: "",
      metaDescription: "",
      tags: [],
    },
  });

  // Load product data when editing
  useEffect(() => {
    if (product && isOpen) {
      form.reset({
        name: product.name || "",
        description: product.description || "",
        shortDescription: product.shortDescription || "",
        sku: product.sku || "",
        price: product.price || 0,
        comparePrice: product.comparePrice || undefined,
        costPrice: product.costPrice || undefined,
        stockQuantity: product.stockQuantity || 0,
        lowStockThreshold: product.lowStockThreshold || 10,
        weight: product.weight || undefined,
        dimensions: product.dimensions || {},
        categoryId: product.categoryId || "",
        brandId: product.brandId || "",
        isActive: product.isActive ?? true,
        isDigital: product.isDigital ?? false,
        isFeatured: product.isFeatured ?? false,
        metaTitle: product.metaTitle || "",
        metaDescription: product.metaDescription || "",
        tags: product.tags || [],
      });
      setTags(product.tags || []);
    }
  }, [product, isOpen, form]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newImages = [...images, ...files];
    
    if (newImages.length > 5) {
      toast({
        title: "Too many images",
        description: "You can upload a maximum of 5 images per product.",
        variant: "destructive",
      });
      return;
    }

    setImages(newImages);

    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previewImages.filter((_, i) => i !== index);
    
    setImages(newImages);
    setPreviewImages(newPreviews);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      setTagInput("");
      form.setValue("tags", newTags);
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    form.setValue("tags", newTags);
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    
    try {
      let productId: string;

      if (isEditing) {
        // Update existing product
        const updatedProduct = await updateProduct({ id: product.id, data });
        productId = updatedProduct.id;
        toast({
          title: "Product updated",
          description: "Product has been updated successfully.",
        });
      } else {
        // Create new product - ensure required fields are present
        const createData = {
          ...data,
          name: data.name,
          sku: data.sku,
          price: data.price,
          stockQuantity: data.stockQuantity,
          categoryId: data.categoryId && data.categoryId !== "none" ? data.categoryId : undefined,
          brandId: data.brandId && data.brandId !== "none" ? data.brandId : undefined,
        };
        const newProduct = await createProduct(createData);
        productId = newProduct.id;
        toast({
          title: "Product created",
          description: "Product has been created successfully.",
        });
      }

      // Upload images if any
      if (images.length > 0) {
        await uploadProductImages({ productId, files: images });
        toast({
          title: "Images uploaded",
          description: "Product images have been uploaded successfully.",
        });
      }

      onSuccess?.();
      onClose();
      form.reset();
      setImages([]);
      setPreviewImages([]);
      setTags([]);
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred while saving the product.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update the product information below." 
              : "Fill in the product details to add a new item to your inventory."
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    {...form.register("name")}
                    placeholder="Enter product name"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sku">SKU *</Label>
                  <Input
                    id="sku"
                    {...form.register("sku")}
                    placeholder="Enter SKU"
                  />
                  {form.formState.errors.sku && (
                    <p className="text-sm text-red-500">{form.formState.errors.sku.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="shortDescription">Short Description</Label>
                <Textarea
                  id="shortDescription"
                  {...form.register("shortDescription")}
                  placeholder="Brief description (max 500 characters)"
                  rows={2}
                />
                {form.formState.errors.shortDescription && (
                  <p className="text-sm text-red-500">{form.formState.errors.shortDescription.message}</p>
                )}
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...form.register("description")}
                  placeholder="Detailed product description"
                  rows={4}
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Inventory */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Pricing & Inventory</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    {...form.register("price", { valueAsNumber: true })}
                    placeholder="0.00"
                  />
                  {form.formState.errors.price && (
                    <p className="text-sm text-red-500">{form.formState.errors.price.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comparePrice">Compare Price</Label>
                  <Input
                    id="comparePrice"
                    type="number"
                    step="0.01"
                    {...form.register("comparePrice", { valueAsNumber: true })}
                    placeholder="0.00"
                  />
                  {form.formState.errors.comparePrice && (
                    <p className="text-sm text-red-500">{form.formState.errors.comparePrice.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="costPrice">Cost Price</Label>
                  <Input
                    id="costPrice"
                    type="number"
                    step="0.01"
                    {...form.register("costPrice", { valueAsNumber: true })}
                    placeholder="0.00"
                  />
                  {form.formState.errors.costPrice && (
                    <p className="text-sm text-red-500">{form.formState.errors.costPrice.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="stockQuantity">Stock Quantity *</Label>
                  <Input
                    id="stockQuantity"
                    type="number"
                    {...form.register("stockQuantity", { valueAsNumber: true })}
                    placeholder="0"
                  />
                  {form.formState.errors.stockQuantity && (
                    <p className="text-sm text-red-500">{form.formState.errors.stockQuantity.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                  <Input
                    id="lowStockThreshold"
                    type="number"
                    {...form.register("lowStockThreshold", { valueAsNumber: true })}
                    placeholder="10"
                  />
                  {form.formState.errors.lowStockThreshold && (
                    <p className="text-sm text-red-500">{form.formState.errors.lowStockThreshold.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category & Brand */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Category & Brand</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category (Optional)</Label>
                  <Select
                    value={form.watch("categoryId")}
                    onValueChange={(value) => form.setValue("categoryId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {categoriesLoading ? (
                        <SelectItem value="loading" disabled>Loading categories...</SelectItem>
                      ) : (
                        categories?.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.categoryId && (
                    <p className="text-sm text-red-500">{form.formState.errors.categoryId.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Brand (Optional)</Label>
                  <Select
                    value={form.watch("brandId")}
                    onValueChange={(value) => form.setValue("brandId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {brandsLoading ? (
                        <SelectItem value="loading" disabled>Loading brands...</SelectItem>
                      ) : (
                        brands?.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id}>
                            {brand.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.brandId && (
                    <p className="text-sm text-red-500">{form.formState.errors.brandId.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Physical Properties */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Physical Properties</h3>
              
              <div className="space-y-2 mb-4">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.01"
                  {...form.register("weight", { valueAsNumber: true })}
                  placeholder="0.00"
                />
                {form.formState.errors.weight && (
                  <p className="text-sm text-red-500">{form.formState.errors.weight.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="length">Length (cm)</Label>
                  <Input
                    id="length"
                    type="number"
                    step="0.01"
                    {...form.register("dimensions.length", { valueAsNumber: true })}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="width">Width (cm)</Label>
                  <Input
                    id="width"
                    type="number"
                    step="0.01"
                    {...form.register("dimensions.width", { valueAsNumber: true })}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.01"
                    {...form.register("dimensions.height", { valueAsNumber: true })}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Product Images</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    id="images"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="gap-2"
                    onClick={() => document.getElementById('images')?.click()}
                  >
                    <Upload className="w-4 h-4" />
                    Upload Images
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Upload up to 5 images (JPG, PNG, WebP, GIF)
                  </p>
                </div>

                {previewImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {previewImages.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Tags</h3>
              
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} disabled={!tagInput.trim()}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 ml-1"
                          onClick={() => removeTag(tag)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Product Status */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Product Status</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isActive"
                    checked={form.watch("isActive")}
                    onCheckedChange={(checked) => form.setValue("isActive", checked as boolean)}
                  />
                  <Label htmlFor="isActive">Active (visible to customers)</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isDigital"
                    checked={form.watch("isDigital")}
                    onCheckedChange={(checked) => form.setValue("isDigital", checked as boolean)}
                  />
                  <Label htmlFor="isDigital">Digital Product</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isFeatured"
                    checked={form.watch("isFeatured")}
                    onCheckedChange={(checked) => form.setValue("isFeatured", checked as boolean)}
                  />
                  <Label htmlFor="isFeatured">Featured Product</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SEO */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">SEO Settings</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    {...form.register("metaTitle")}
                    placeholder="SEO title (max 60 characters)"
                    maxLength={60}
                  />
                  {form.formState.errors.metaTitle && (
                    <p className="text-sm text-red-500">{form.formState.errors.metaTitle.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {form.watch("metaTitle")?.length || 0}/60 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    {...form.register("metaDescription")}
                    placeholder="SEO description (max 160 characters)"
                    rows={3}
                    maxLength={160}
                  />
                  {form.formState.errors.metaDescription && (
                    <p className="text-sm text-red-500">{form.formState.errors.metaDescription.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {form.watch("metaDescription")?.length || 0}/160 characters
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEditing ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
