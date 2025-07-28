

export type OrderType = {
    id: string;
    ordred_in: string;
    product_image: string;
    product_name: string;
    quantity: number;
    seller: {
        name: string;
        profile_image: string;
        email: string;
    };
    status: string;
    total_mount: number;
}