import { useState, useEffect } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCategoryAPI } from "@/hooks/useCategoryAPI";
import { useCategories } from "@/hooks/useCategoryAPI";
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
  metaTitle?: string;
  metaDescription?: string;
  productCount: number;
  childrenCount: number;
  parent?: { id: string; name: string; slug: string };
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
  onSuccess: () => void;
}

export function CategoryFormModal({ isOpen, onClose, category, onSuccess }: CategoryFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parentId: "",
    categoryType: "",
    sortOrder: 0,
    isActive: true,
    isVisibleInMenu: true,
    icon: "",
    bannerImage: "",
    featuredOrder: 0,
    metaTitle: "",
    metaDescription: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createCategory, updateCategory } = useCategoryAPI();
  const { data: categoriesData } = useCategories({ limit: 1000 }); // Get all categories for parent selection

  const categories = categoriesData?.data?.categories || [];
  const availableParents = categories.filter(cat => 
    !category || cat.id !== category.id // Exclude self from parent options
  );

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        description: category.description || "",
        parentId: category.parentId || "",
        categoryType: category.categoryType || "",
        sortOrder: category.sortOrder || 0,
        isActive: category.isActive ?? true,
        isVisibleInMenu: category.isVisibleInMenu ?? true,
        icon: category.icon || "",
        bannerImage: category.bannerImage || "",
        featuredOrder: category.featuredOrder || 0,
        metaTitle: category.metaTitle || "",
        metaDescription: category.metaDescription || "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        parentId: "",
        categoryType: "",
        sortOrder: 0,
        isActive: true,
        isVisibleInMenu: true,
        icon: "",
        bannerImage: "",
        featuredOrder: 0,
        metaTitle: "",
        metaDescription: "",
      });
    }
    setErrors({});
  }, [category, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Category name is required";
    }

    if (formData.name.length > 100) {
      newErrors.name = "Category name must be less than 100 characters";
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    if (formData.metaTitle && formData.metaTitle.length > 60) {
      newErrors.metaTitle = "Meta title must be less than 60 characters";
    }

    if (formData.metaDescription && formData.metaDescription.length > 160) {
      newErrors.metaDescription = "Meta description must be less than 160 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        parentId: formData.parentId || undefined,
        sortOrder: Number(formData.sortOrder),
        featuredOrder: Number(formData.featuredOrder),
      };

      if (category) {
        await updateCategory({ id: category.id, ...submitData });
        toast({
          title: "Success",
          description: "Category updated successfully",
        });
      } else {
        await createCategory(submitData);
        toast({
          title: "Success",
          description: "Category created successfully",
        });
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save category",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const getParentLevel = (parentId: string) => {
    const parent = categories.find(cat => cat.id === parentId);
    return parent ? parent.level + 1 : 1;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {category ? "Edit Category" : "Create New Category"}
          </DialogTitle>
          <DialogDescription>
            {category 
              ? "Update the category information and settings."
              : "Add a new category to organize your products."
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter category name"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Enter category description"
                  rows={3}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && (
                  <p className="text-sm text-red-500 mt-1">{errors.description}</p>
                )}
              </div>

              <div>
                <Label htmlFor="parentId">Parent Category</Label>
                <Select
                  value={formData.parentId}
                  onValueChange={(value) => handleInputChange("parentId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent category (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Parent (Root Category)</SelectItem>
                    {availableParents.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {"—".repeat(cat.level - 1)} {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.parentId && (
                  <p className="text-sm text-muted-foreground mt-1">
                    This will be a Level {getParentLevel(formData.parentId)} category
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="categoryType">Category Type</Label>
                <Select
                  value={formData.categoryType}
                  onValueChange={(value) => handleInputChange("categoryType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Type</SelectItem>
                    <SelectItem value="main">Main Category</SelectItem>
                    <SelectItem value="sub">Sub Category</SelectItem>
                    <SelectItem value="accessory">Accessory</SelectItem>
                    <SelectItem value="part">Part</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => handleInputChange("sortOrder", parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="featuredOrder">Featured Order</Label>
                <Input
                  id="featuredOrder"
                  type="number"
                  value={formData.featuredOrder}
                  onChange={(e) => handleInputChange("featuredOrder", parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="isActive">Active</Label>
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="isVisibleInMenu">Visible in Menu</Label>
                  <Switch
                    id="isVisibleInMenu"
                    checked={formData.isVisibleInMenu}
                    onCheckedChange={(checked) => handleInputChange("isVisibleInMenu", checked)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Images</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="icon">Icon URL</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => handleInputChange("icon", e.target.value)}
                  placeholder="https://example.com/icon.png"
                />
                {formData.icon && (
                  <div className="mt-2">
                    <img 
                      src={formData.icon} 
                      alt="Icon preview" 
                      className="w-8 h-8 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="bannerImage">Banner Image URL</Label>
                <Input
                  id="bannerImage"
                  value={formData.bannerImage}
                  onChange={(e) => handleInputChange("bannerImage", e.target.value)}
                  placeholder="https://example.com/banner.jpg"
                />
                {formData.bannerImage && (
                  <div className="mt-2">
                    <img 
                      src={formData.bannerImage} 
                      alt="Banner preview" 
                      className="w-full h-20 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">SEO Settings</h3>
            <div>
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input
                id="metaTitle"
                value={formData.metaTitle}
                onChange={(e) => handleInputChange("metaTitle", e.target.value)}
                placeholder="SEO title for search engines"
                maxLength={60}
                className={errors.metaTitle ? "border-red-500" : ""}
              />
              <p className="text-sm text-muted-foreground mt-1">
                {formData.metaTitle.length}/60 characters
              </p>
              {errors.metaTitle && (
                <p className="text-sm text-red-500 mt-1">{errors.metaTitle}</p>
              )}
            </div>

            <div>
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                value={formData.metaDescription}
                onChange={(e) => handleInputChange("metaDescription", e.target.value)}
                placeholder="SEO description for search engines"
                rows={3}
                maxLength={160}
                className={errors.metaDescription ? "border-red-500" : ""}
              />
              <p className="text-sm text-muted-foreground mt-1">
                {formData.metaDescription.length}/160 characters
              </p>
              {errors.metaDescription && (
                <p className="text-sm text-red-500 mt-1">{errors.metaDescription}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : category ? "Update Category" : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

