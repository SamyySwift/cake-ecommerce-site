
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useProduct, useProducts } from '@/hooks/useProducts';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogFooter 
} from '@/components/ui/dialog';
import { Pencil, Trash2, Plus, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import ProductForm from '@/components/admin/ProductForm';
import type { Product } from '@/data/products';
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"

const AdminProducts = () => {
  const { data: products, isLoading, refetch } = useProducts();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const filteredProducts = products?.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (!selectedProduct) return;
    
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', selectedProduct.id);
        
      if (error) throw error;
      
      toast({
        title: "Product deleted",
        description: `${selectedProduct.name} has been deleted successfully`
      });
      
      refetch();
    } catch (error: any) {
      toast({
        title: "Error deleting product",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const toggleProductFeatured = async (product: Product, field: 'bestseller' | 'newArrival' | 'sameDay') => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ [field]: !product[field] })
        .eq('id', product.id);
        
      if (error) throw error;
      
      toast({
        title: "Product updated",
        description: `${product.name} has been updated successfully`
      });
      
      refetch();
    } catch (error: any) {
      toast({
        title: "Error updating product",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={() => {
          setSelectedProduct(null);
          setIsDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>
      
      <Card className="mb-6">
        <div className="p-4 flex items-center">
          <Search className="mr-2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search products by name or category..."
            className="border-0 focus-visible:ring-0 flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>
      
      {isLoading ? (
        <div className="text-center py-8">Loading products...</div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-center">Bestseller</TableHead>
                <TableHead className="text-center">New Arrival</TableHead>
                <TableHead className="text-center">Same Day</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts && filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-md overflow-hidden mr-3">
                          <img 
                            src={product.image_url || '/placeholder.svg'} 
                            className="h-full w-full object-cover"
                            alt={product.name} 
                          />
                        </div>
                        {product.name}
                      </div>
                    </TableCell>
                    <TableCell>{product.category || '-'}</TableCell>
                    <TableCell className="text-center">
                      <Switch 
                        checked={product.bestseller || false}
                        onCheckedChange={() => toggleProductFeatured(product, 'bestseller')}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch 
                        checked={product.newArrival || false}
                        onCheckedChange={() => toggleProductFeatured(product, 'newArrival')}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch 
                        checked={product.sameDay || false}
                        onCheckedChange={() => toggleProductFeatured(product, 'sameDay')}
                      />
                    </TableCell>
                    <TableCell className="text-right">${product.price}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteProduct(product)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Product Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
          </DialogHeader>
          <ProductForm 
            initialProduct={selectedProduct}
            onSuccess={() => {
              setIsDialogOpen(false);
              refetch();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete {selectedProduct?.name}? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDeleteProduct}
              disabled={isProcessing}
            >
              {isProcessing ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
