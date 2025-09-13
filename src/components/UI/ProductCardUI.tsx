import { ProductType } from "@/types/product";




interface ProductCardUIProps {
    product: ProductType;
}
export function ProductCardUI({ product }: ProductCardUIProps){
    return (
        <section>
            {JSON.stringify(product)}
        </section>
    )
}