import { RefreshCw } from 'lucide-react';
interface EmptyStateProps {
    onClear: () => void;
}

export const EmptyState = ({ onClear }: EmptyStateProps) => (
    <div className="text-center py-24 bg-white rounded-xl border border-gray-200">
        <h3 className="text-2xl font-semibold text-gray-900">No products found</h3>
        <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
        <button 
            onClick={onClear} 
            className={`mt-6 inline-flex items-center gap-2 px-5 py-2.5 
                font-semibold rounded-lg hover:bg-blue-700
                hover:from-neutral-900 hover:via-neutral-900 hover:to-neutral-900 cursor-pointer`}
        >
            <RefreshCw size={16} /> Clear all filters
        </button>
    </div>
);