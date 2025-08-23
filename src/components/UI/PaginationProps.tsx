// This is a simplified pagination component. You can enhance it with "..." for many pages.
interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        currentPage === page
                            ? 'bg-teal-600 text-white shadow-sm'
                            : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                    {page}
                </button>
            ))}
        </div>
    );
};