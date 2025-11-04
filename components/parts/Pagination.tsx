export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    itemsPerPage
}: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems: number;
    itemsPerPage: number;
}) {
    const getVisiblePages = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        const end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-8 border-t border-gray-200">
            {/* Items counter */}
            <div className="text-sm text-gray-600">
                Showing <span className="font-semibold">{startItem}-{endItem}</span> of{' '}
                <span className="font-semibold">{totalItems}</span> categories
            </div>

            {/* Pagination controls */}
            <div className="flex items-center gap-2">
                {/* Previous button */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                </button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                    {currentPage > 3 && (
                        <>
                            <button
                                onClick={() => onPageChange(1)}
                                className="w-10 h-10 flex items-center justify-center text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
                            >
                                1
                            </button>
                            <span className="px-2 text-gray-400">...</span>
                        </>
                    )}

                    {getVisiblePages().map(page => (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`w-10 h-10 flex items-center justify-center border rounded-lg transition-all duration-200 ${currentPage === page
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                    : 'text-gray-600 bg-white border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            {page}
                        </button>
                    ))}

                    {currentPage < totalPages - 2 && (
                        <>
                            <span className="px-2 text-gray-400">...</span>
                            <button
                                onClick={() => onPageChange(totalPages)}
                                className="w-10 h-10 flex items-center justify-center text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
                            >
                                {totalPages}
                            </button>
                        </>
                    )}
                </div>

                {/* Next button */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                    Next
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
