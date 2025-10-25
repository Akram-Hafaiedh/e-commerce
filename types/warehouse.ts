export interface Warehouse {
    id: string;
    name: string;
    code: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
    type: 'MAIN' | 'REGIONAL' | 'STORE' | 'VIRTUAL';
    isActive: boolean;
    createdAt: string;
}