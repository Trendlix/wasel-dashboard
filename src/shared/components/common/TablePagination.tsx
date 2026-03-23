import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface ITablePagination {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const TablePagination = ({ currentPage, totalPages, onPageChange }: ITablePagination) => {
    const getPages = () => {
        const pages: (number | "ellipsis")[] = [];

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push("ellipsis");
            for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                pages.push(i);
            }
            if (currentPage < totalPages - 2) pages.push("ellipsis");
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-between px-6 py-4 border-t border-main-whiteMarble">
            <span className="text-main-sharkGray text-sm text-nowrap">
                Page <span className="font-semibold text-main-mirage">{currentPage}</span> of{" "}
                <span className="font-semibold text-main-mirage">{totalPages}</span>
            </span>

            <Pagination>
                <PaginationContent>
                    {/* Previous */}
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                    </PaginationItem>

                    {/* Pages */}
                    {getPages().map((page, index) =>
                        page === "ellipsis" ? (
                            <PaginationItem key={`ellipsis-${index}`}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        ) : (
                            <PaginationItem key={page}>
                                <PaginationLink
                                    isActive={page === currentPage}
                                    onClick={() => onPageChange(page)}
                                    className={page === currentPage
                                        ? "cursor-pointer bg-main-primary text-main-white hover:bg-main-primary/90 hover:text-main-white"
                                        : "cursor-pointer"
                                    }
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        )
                    )}

                    {/* Next */}
                    <PaginationItem>
                        <PaginationNext
                            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
};

export default TablePagination;