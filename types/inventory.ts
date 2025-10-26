export interface InventoryItem {
    id: string;
    productId: string;
    warehouseId: string;
    quantity: number;
    minStock: number | null;
    maxStock: number | null;
    reorderPoint: number | null;
    lastUpdated: string;
    product: {
        id: string;
        name: string;
        slug: string;
        image: string;
        price: number;
    };
    warehouse: {
        id: string;
        name: string;
        code: string;
        type: string;
    };
}