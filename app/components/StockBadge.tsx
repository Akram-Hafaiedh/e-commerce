
interface StockBadgeProps {
    stock: number
    threshold: number
}
export default function StockBadge({ stock, threshold }: StockBadgeProps) {
    if (stock === 0) {
        return (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Out of Stock
            </span>
        )
    }
    if (stock <= threshold) {
        return (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                Only {stock} left!
            </span>
        )
    }

    return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            In Stock
        </span>
    )
}