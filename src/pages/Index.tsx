import { useState, useMemo } from 'react';
import { Package, DollarSign, TrendingUp, AlertTriangle, Plus } from 'lucide-react';
import { Product, ViewMode, ProductFormData } from '@/types/product';
import { useProducts, usePagination } from '@/hooks/useProducts';
import { useDebounce } from '@/hooks/useDebounce';
import { Button } from '@/components/ui/button';
import { ViewToggle } from '@/components/dashboard/ViewToggle';
import { SearchInput } from '@/components/dashboard/SearchInput';
import { ProductCard } from '@/components/dashboard/ProductCard';
import { ProductTable } from '@/components/dashboard/ProductTable';
import { Pagination } from '@/components/dashboard/Pagination';
import { ProductFormDialog } from '@/components/dashboard/ProductFormDialog';
import { DeleteConfirmDialog } from '@/components/dashboard/DeleteConfirmDialog';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 6;

const Index = () => {
  const { products, addProduct, updateProduct, deleteProduct, getProductById } = useProducts();
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 500);

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    if (!debouncedSearch.trim()) return products;
    const query = debouncedSearch.toLowerCase();
    return products.filter((product) =>
      product.name.toLowerCase().includes(query)
    );
  }, [products, debouncedSearch]);

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    hasNextPage,
    hasPrevPage,
  } = usePagination(filteredProducts, ITEMS_PER_PAGE);

  // Stats calculations
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalValue = products.reduce((acc, p) => acc + p.price * p.stock, 0);
    const avgPrice = products.reduce((acc, p) => acc + p.price, 0) / totalProducts || 0;
    const lowStock = products.filter((p) => p.stock <= 10).length;
    return { totalProducts, totalValue, avgPrice, lowStock };
  }, [products]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      const product = getProductById(deleteId);
      deleteProduct(deleteId);
      toast.success(`"${product?.name}" has been deleted`);
      setDeleteId(null);
    }
  };

  const handleFormSubmit = (data: ProductFormData) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, data);
      toast.success(`"${data.name}" has been updated`);
    } else {
      addProduct(data);
      toast.success(`"${data.name}" has been added`);
    }
  };

  const productToDelete = deleteId ? getProductById(deleteId) : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <Package className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Product Hub</h1>
                <p className="text-sm text-muted-foreground hidden sm:block">
                  Manage your inventory
                </p>
              </div>
            </div>
            <Button onClick={handleAddProduct} className="gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Product</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
          <StatsCard
            title="Total Products"
            value={stats.totalProducts}
            icon={Package}
          />
          <StatsCard
            title="Inventory Value"
            value={`$${stats.totalValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
            icon={DollarSign}
          />
          <StatsCard
            title="Average Price"
            value={`$${stats.avgPrice.toFixed(2)}`}
            icon={TrendingUp}
          />
          <StatsCard
            title="Low Stock Items"
            value={stats.lowStock}
            icon={AlertTriangle}
          />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search products..."
          />
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </span>
            <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
          </div>
        </div>

        {/* Products Display */}
        {paginatedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">No products found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'Try adjusting your search' : 'Get started by adding your first product'}
            </p>
            {!searchQuery && (
              <Button onClick={handleAddProduct} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            )}
          </div>
        ) : viewMode === 'card' ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedItems.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleEditProduct}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        ) : (
          <ProductTable
            products={paginatedItems}
            onEdit={handleEditProduct}
            onDelete={handleDeleteClick}
          />
        )}

        {/* Pagination */}
        {filteredProducts.length > ITEMS_PER_PAGE && (
          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
              hasNextPage={hasNextPage}
              hasPrevPage={hasPrevPage}
            />
          </div>
        )}
      </main>

      {/* Dialogs */}
      <ProductFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        product={editingProduct}
        onSubmit={handleFormSubmit}
      />

      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        productName={productToDelete?.name}
      />
    </div>
  );
};

export default Index;
