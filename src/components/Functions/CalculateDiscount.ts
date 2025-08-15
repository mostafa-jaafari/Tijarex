




export function CalculateDiscount(SalePrice:number | undefined, RegularPrice:number | undefined){
    if(!SalePrice || !RegularPrice) return SalePrice;

    const Discount = ((RegularPrice - SalePrice) / RegularPrice) * 100;
    return Discount.toFixed(2);
}