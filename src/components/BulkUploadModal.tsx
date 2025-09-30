import { useState } from "react";
import { Upload, Download, X, CheckCircle, AlertCircle, FileSpreadsheet } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface BulkUploadResult {
  success: boolean;
  message: string;
  data?: {
    total: number;
    success: number;
    failed: number;
    errors?: Array<{
      row: number;
      field: string;
      message: string;
    }>;
  };
}

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function BulkUploadModal({ isOpen, onClose, onSuccess }: BulkUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<BulkUploadResult | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setUploadResult(null);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select a CSV file.",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // TODO: Replace with actual API call
      const response = await fetch('/api/v1/products/bulk-upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const result: BulkUploadResult = await response.json();
      setUploadResult(result);

      if (result.success) {
        toast({
          title: "Upload successful",
          description: `Successfully imported ${result.data?.success || 0} products.`,
        });
        onSuccess?.();
      } else {
        toast({
          title: "Upload failed",
          description: result.message,
          variant: "destructive",
        });
      }

    } catch (error) {
      setUploadProgress(0);
      toast({
        title: "Upload failed",
        description: "An error occurred while uploading the file.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    // Create CSV template
    const headers = [
      'name',
      'description',
      'shortDescription',
      'sku',
      'price',
      'comparePrice',
      'costPrice',
      'stockQuantity',
      'lowStockThreshold',
      'weight',
      'categoryId',
      'brandId',
      'isActive',
      'isDigital',
      'isFeatured',
      'metaTitle',
      'metaDescription',
      'tags'
    ];

    const sampleRow = [
      'Sample Product',
      'This is a sample product description',
      'Short description',
      'SAMPLE-001',
      '99.99',
      '119.99',
      '50.00',
      '10',
      '5',
      '1.5',
      'category-uuid-here',
      'brand-uuid-here',
      'true',
      'false',
      'false',
      'Sample Product Title',
      'Sample product meta description',
      'sample,tag,product'
    ];

    const csvContent = [headers, sampleRow].map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'product-template.csv';
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Template downloaded",
      description: "Product template CSV has been downloaded.",
    });
  };

  const handleClose = () => {
    setFile(null);
    setUploadResult(null);
    setUploadProgress(0);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Bulk Product Upload</DialogTitle>
          <DialogDescription>
            Upload multiple products at once using a CSV file. Download the template to see the required format.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Download */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">1. Download Template</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Download the CSV template to see the required format and column structure.
              </p>
              <Button variant="outline" onClick={downloadTemplate} className="gap-2">
                <Download className="w-4 h-4" />
                Download Template
              </Button>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">2. Upload CSV File</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                  <div className="text-center">
                    <FileSpreadsheet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    
                    {file ? (
                      <div className="space-y-2">
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setFile(null)}
                          className="gap-2"
                        >
                          <X className="w-4 h-4" />
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-muted-foreground">Choose a CSV file to upload</p>
                        <input
                          type="file"
                          accept=".csv"
                          onChange={handleFileSelect}
                          className="hidden"
                          id="csv-upload"
                        />
                        <Button asChild variant="outline">
                          <label htmlFor="csv-upload" className="cursor-pointer gap-2">
                            <Upload className="w-4 h-4" />
                            Select CSV File
                          </label>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {file && (
                  <Button 
                    onClick={handleUpload} 
                    disabled={isUploading}
                    className="w-full gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    {isUploading ? 'Uploading...' : 'Upload Products'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upload Progress */}
          {isUploading && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading products...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upload Results */}
          {uploadResult && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  {uploadResult.success ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                  Upload Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                {uploadResult.success && uploadResult.data ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-500">
                          {uploadResult.data.success}
                        </p>
                        <p className="text-sm text-muted-foreground">Success</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-500">
                          {uploadResult.data.failed}
                        </p>
                        <p className="text-sm text-muted-foreground">Failed</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">
                          {uploadResult.data.total}
                        </p>
                        <p className="text-sm text-muted-foreground">Total</p>
                      </div>
                    </div>

                    {uploadResult.data.errors && uploadResult.data.errors.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-red-500">Errors:</h4>
                        <div className="max-h-32 overflow-y-auto space-y-1">
                          {uploadResult.data.errors.map((error, index) => (
                            <div key={index} className="text-sm bg-red-50 p-2 rounded">
                              <Badge variant="destructive" className="mr-2">
                                Row {error.row}
                              </Badge>
                              {error.field}: {error.message}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-red-500">{uploadResult.message}</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <ul className="list-disc list-inside space-y-1">
                <li>Download the template to see the required CSV format</li>
                <li>Required fields: name, sku, price, stockQuantity, categoryId, brandId</li>
                <li>categoryId and brandId must be valid UUIDs from your categories and brands</li>
                <li>Boolean fields (isActive, isDigital, isFeatured) should be 'true' or 'false'</li>
                <li>Tags should be comma-separated values</li>
                <li>Maximum file size: 10MB</li>
                <li>Partial imports are allowed - failed rows will be reported</li>
              </ul>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleClose}>
              {uploadResult ? 'Close' : 'Cancel'}
            </Button>
            {uploadResult && !isUploading && (
              <Button onClick={handleClose}>
                Done
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
