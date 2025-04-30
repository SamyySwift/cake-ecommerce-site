
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from "@/components/ui/switch"
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Plus, X, Upload } from 'lucide-react';
import type { Product } from '@/data/products';

interface ProductFormProps {
  initialProduct: Product | null;
  onSuccess: () => void;
}

const ProductForm = ({ initialProduct, onSuccess }: ProductFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState<Partial<Product>>(
    initialProduct || {
      name: '',
      description: '',
      price: 0,
      category: '',
      image_url: '', // Note: it's image_url, not image
      flavors: [],
      sizes: [],
      bestseller: false,
      newArrival: false,
      sameDay: false
    }
  );
  
  const [flavors, setFlavors] = useState<string[]>(initialProduct?.flavors || []);
  const [newFlavor, setNewFlavor] = useState('');
  
  const [sizes, setSizes] = useState<{name: string, price: number}[]>(
    initialProduct?.sizes as {name: string, price: number}[] || []
  );
  const [newSize, setNewSize] = useState({ name: '', price: 0 });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setProduct(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleCategoryChange = (value: string) => {
    setProduct(prev => ({ ...prev, category: value }));
  };
  
  const handleAddFlavor = () => {
    if (newFlavor && !flavors.includes(newFlavor)) {
      setFlavors(prev => [...prev, newFlavor]);
      setNewFlavor('');
    }
  };
  
  const handleRemoveFlavor = (flavor: string) => {
    setFlavors(prev => prev.filter(f => f !== flavor));
  };
  
  const handleAddSize = () => {
    if (newSize.name && newSize.price > 0) {
      setSizes(prev => [...prev, newSize]);
      setNewSize({ name: '', price: 0 });
    }
  };
  
  const handleRemoveSize = (sizeName: string) => {
    setSizes(prev => prev.filter(s => s.name !== sizeName));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };
  
  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return product.image_url || '';
    
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `products/${fileName}`;
    
    try {
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, imageFile);
      
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Upload image if one was selected
      let imageUrl = product.image_url || '';
      if (imageFile) {
        imageUrl = await uploadImage();
      }
      
      // Convert sizes to JSONB array format
      const formattedSizes = sizes.map(size => JSON.stringify(size));
      
      const productData = {
        name: product.name,
        description: product.description,
        price: product.price || 0,
        category: product.category,
        image_url: imageUrl,
        flavors: flavors,
        sizes: sizes, // Just pass the sizes array directly
        bestseller: product.bestseller || false,
        newArrival: product.newArrival || false,
        sameDay: product.sameDay || false
      };
      
      if (initialProduct) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', initialProduct.id);
        
        if (error) throw error;
        
        toast({
          title: "Product updated",
          description: `${product.name} has been updated successfully`
        });
      } else {
        // Create new product
        const { error } = await supabase
          .from('products')
          .insert([productData]);
        
        if (error) throw error;
        
        toast({
          title: "Product created",
          description: `${product.name} has been created successfully`
        });
      }
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              name="name"
              value={product.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={product.description}
              onChange={handleChange}
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={product.category || ''}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Wedding Cakes">Wedding</SelectItem>
                <SelectItem value="Birthday Cakes">Birthday</SelectItem>
                <SelectItem value="Cupcakes">Cupcakes</SelectItem>
                <SelectItem value="Specialty Cakes">Specialty</SelectItem>
                <SelectItem value="Cheesecakes">CheeseCake</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">Base Price (₦) *</Label>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={product.price.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Product Image</Label>
            <div className="flex items-center gap-4">
              {(product.image_url || imageFile) && (
                <div className="h-20 w-20 rounded-md overflow-hidden">
                  <img 
                    src={imageFile ? URL.createObjectURL(imageFile) : product.image_url} 
                    className="h-full w-full object-cover"
                    alt="Product preview" 
                  />
                </div>
              )}
              <label className="cursor-pointer">
                <div className="flex items-center justify-center px-4 py-2 border border-dashed rounded-md hover:bg-gray-50">
                  <Upload className="h-4 w-4 mr-2" />
                  <span>{product.image_url ? 'Change Image' : 'Upload Image'}</span>
                </div>
                <Input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Product Features</Label>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Bestseller</span>
                <Switch 
                  checked={product.bestseller || false} 
                  onCheckedChange={(checked) => handleSwitchChange('bestseller', checked)} 
                />
              </div>
              <div className="flex items-center justify-between">
                <span>New Arrival</span>
                <Switch 
                  checked={product.newArrival || false} 
                  onCheckedChange={(checked) => handleSwitchChange('newArrival', checked)} 
                />
              </div>
              <div className="flex items-center justify-between">
                <span>Same Day Delivery</span>
                <Switch 
                  checked={product.sameDay || false} 
                  onCheckedChange={(checked) => handleSwitchChange('sameDay', checked)} 
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <Label>Flavors</Label>
            <div className="flex flex-wrap gap-2 mb-4">
              {flavors.map(flavor => (
                <div key={flavor} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                  <span className="mr-1">{flavor}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFlavor(flavor)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input
                value={newFlavor}
                onChange={(e) => setNewFlavor(e.target.value)}
                placeholder="Add a flavor"
                className="flex-1"
              />
              <Button type="button" onClick={handleAddFlavor} disabled={!newFlavor}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <Label>Size Options</Label>
            <div className="space-y-2 mb-4">
              {sizes.map(size => (
                <div key={size.name} className="flex items-center justify-between bg-gray-100 rounded px-3 py-2">
                  <div>
                    <span className="font-medium">{size.name}</span>
                    <span className="ml-2 text-gray-500">₦{size.price.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSize(size.name)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Input
                value={newSize.name}
                onChange={(e) => setNewSize({...newSize, name: e.target.value})}
                placeholder="Size name"
                className="col-span-1"
              />
              <Input
                type="number"
                min="0"
                step="0.01"
                value={newSize.price || ''}
                onChange={(e) => setNewSize({...newSize, price: parseFloat(e.target.value) || 0})}
                placeholder="Price (₦)"
                className="col-span-1"
              />
              <Button 
                type="button" 
                onClick={handleAddSize}
                disabled={!newSize.name || newSize.price <= 0}
                className="col-span-1"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : initialProduct ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
