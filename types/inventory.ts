import { Product } from "./product";
import { Warehouse } from "./warehouse";

export interface InventoryItem {
    id: string;
    productId: string;
    warehouseId: string;
    quantity: number;
    reserved: number;         // NEW
    available: number;        // NEW
    minStock: number | null;
    maxStock: number | null;
    reorderPoint: number | null;
    lastUpdated: string;
    product: Product;
    warehouse: Warehouse;
}