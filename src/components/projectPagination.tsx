import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationEllipsis,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ProjectPagination = ({
  totalPages,
  currentPage,
  onPageChange,
  itemsPerPage,
  setItemsPerPage,
  filteredData,
  projects,
  searchQuery,
  indexOfFirstItem,
  indexOfLastItem,
}: any) => {
  const getPageNumbers = () => {
    const pageNumbers = [];

    if (totalPages <= 4) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      if (currentPage <= 2) end = 3;
      if (currentPage >= totalPages - 1) start = totalPages - 2;
      if (start > 2) pageNumbers.push("ellipsis-start");
      for (let i = start; i <= end; i++) pageNumbers.push(i);
      if (end < totalPages - 1) pageNumbers.push("ellipsis-end");
      pageNumbers.push(totalPages);
    }
    return pageNumbers;
  };

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center space-x-2 w-full">
        <p className="text-sm hidden md:block text-muted-foreground">
          {filteredData.length > 0 ? (
            <>
              Showing{" "}
              <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(indexOfLastItem, filteredData.length)}
              </span>{" "}
              of <span className="font-medium">{filteredData.length}</span>{" "}
              entries
              {searchQuery && (
                <> (filtered from {projects.length} total entries)</>
              )}
            </>
          ) : (
            "No matching entries found"
          )}
        </p>
        <div className="flex items-center space-x-2">
          <p className="text-sm hidden md:block text-muted-foreground">
            Rows per page
          </p>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => {
              setItemsPerPage(Number(value));
              onPageChange(1);
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={itemsPerPage.toString()} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="15">15</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Pagination className="justify-end">
        <PaginationContent>
          <PaginationItem className="hidden lg:flex">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 cursor-pointer"
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
              <span className="sr-only">First page</span>
            </Button>
          </PaginationItem>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(currentPage - 1);
              }}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>
          {getPageNumbers().map((page, index) =>
            page === "ellipsis-start" || page === "ellipsis-end" ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : searchQuery ? (
              ""
            ) : (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  isActive={page === currentPage}
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(Number(page));
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(currentPage + 1);
              }}
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
          <PaginationItem className="hidden lg:flex ">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 cursor-pointer"
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
              <span className="sr-only">Last page</span>
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default ProjectPagination;
