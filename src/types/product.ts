export type ProductType = {
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

export interface ProductCardProps{
    PRODUCTIMAGE: string;
    PRODUCTID: string | number;
    PRODUCTTITLE: string;
    PRODUCTPRICE: number;
    PRODUCTCATEGORIE: string;
    OWNER?: {
        name: string;
        image: string;
    };
    STOCK: number;
}