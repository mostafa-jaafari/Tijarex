export const getStockBadge = (stock: number) => {
        if (stock === 0) {
            return (
                <span className="px-2 py-1 text-xs font-semibold border border-current/30 rounded-full bg-red-100 text-red-600">
                    Out of Stock
                </span>
            );
        } 
        if (stock > 0 && stock <= 10) {
            return (
                <span className="px-2 py-1 text-xs font-semibold border border-current/30 rounded-full bg-yellow-100 text-yellow-700">
                    Low Stock ({stock})
                </span>
            );
        } 
        if (stock > 10) {
            return (
                <span className="px-2 py-1 text-xs font-semibold border border-current/30 rounded-full bg-green-100 text-green-700">
                    In Stock ({stock})
                </span>
            );
        }

        // fallback (لو في خطأ بالـ stock)
        return null;
    };