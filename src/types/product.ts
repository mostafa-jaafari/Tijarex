export type Product = {
    id: string;
    name: string;
    category: string;
    product_images: string[];
    sale_price: number;
    regular_price: number;
    stock: number;
    status: string;
    sales: number;
    revenue: number;
    lastUpdated: string;
    rating: number;
    currency: string;
    reviewCount: number;
    description: string;
    sizes: [
        {
            label: string;
            available: boolean;
        }
    ];
    colors: [
        {
            name: string;
            color: string;
            selected: boolean;
        }
    ];
};