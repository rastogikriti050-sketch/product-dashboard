import { Product } from '@/types/product';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const stockStatus = product.stock > 50 ? 'success' : product.stock > 10 ? 'warning' : 'destructive';
  
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-card-hover animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <Package className="h-5 w-5 text-accent" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground line-clamp-1">{product.name}</h3>
              <Badge variant="secondary" className="text-xs font-medium">
                {product.category}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        {product.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-foreground">
            ${product.price.toFixed(2)}
          </span>
          <Badge
            variant="outline"
            className={cn(
              'text-xs',
              stockStatus === 'success' && 'border-success/50 bg-success/10 text-success',
              stockStatus === 'warning' && 'border-warning/50 bg-warning/10 text-warning',
              stockStatus === 'destructive' && 'border-destructive/50 bg-destructive/10 text-destructive'
            )}
          >
            {product.stock} in stock
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="pt-3 border-t border-border">
        <div className="flex w-full gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(product)}
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(product.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
