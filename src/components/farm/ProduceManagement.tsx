
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash, Edit, Eye, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Produce } from '@/types/farmer';

interface ProduceManagementProps {
  userProduce: Produce[];
  onDeleteProduce: (id: string) => void;
  onEditProduce: (produce: Produce) => void;
}

const ProduceManagement: React.FC<ProduceManagementProps> = ({ 
  userProduce, 
  onDeleteProduce, 
  onEditProduce 
}) => {
  const { toast } = useToast();

  const handleDelete = (produce: Produce) => {
    onDeleteProduce(produce.id);
    toast({
      title: "Produit supprimé",
      description: `${produce.name} a été supprimé de vos annonces.`,
    });
  };

  const getQualityColor = (grade: string) => {
    switch (grade.toLowerCase()) {
      case 'a': return 'bg-green-100 text-green-800 border-green-200';
      case 'b': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'c': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-green-600" />
          Mes Produits en Vente
        </CardTitle>
      </CardHeader>
      <CardContent>
        {userProduce.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Aucun produit en vente</p>
            <Button className="mt-4">Ajouter un produit</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {userProduce.map((produce) => (
              <div key={produce.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    {typeof (produce as any).image_url === 'string' && (produce as any).image_url && (
                      <img src={(produce as any).image_url} alt={produce.name} className="h-16 w-16 object-cover rounded" />
                    )}
                    <div>
                      <h3 className="font-semibold text-lg">{produce.name}</h3>
                      <p className="text-muted-foreground">{produce.category}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getQualityColor(produce.qualityGrade)}>
                      Grade {produce.qualityGrade}
                    </Badge>
                    <Badge variant="outline">{produce.county}</Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Quantité</p>
                    <p className="font-medium">{produce.quantity} {produce.unit}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Disponible dès</p>
                    <p className="font-medium">{produce.availableFrom}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Agriculteur</p>
                    <p className="font-medium">{produce.farmer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ID Produit</p>
                    <p className="font-medium text-xs">{produce.id.slice(0, 8)}...</p>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Voir
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onEditProduce(produce)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                  {/* Contact Seller button can be implemented with actual contact info if available */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive">
                        <Trash className="h-4 w-4 mr-2" />
                        Supprimer
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                        <AlertDialogDescription>
                          Êtes-vous sûr de vouloir supprimer "{produce.name}" de vos annonces ? 
                          Cette action est irréversible et supprimera définitivement votre produit de la marketplace.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDelete(produce)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Supprimer définitivement
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProduceManagement;
