
import { useState } from "react";
import loaderImg from "./assets/loader.svg";


export const Table = ({
  columns = [],
  currentData = [],
  containerClassName = '',
  tableClassName = '',
  isLoading = false,
  onRowClick,
}) => {
  // Constants
  const ITEMS_PER_PAGE = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(currentData.length / ITEMS_PER_PAGE);

  // Pagination logic
  const paginatedData = currentData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handlers
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePageClick = (page) => typeof page === "number" && setCurrentPage(page);

  // Renderers
  const renderLoaderRow = () => (
    <tr>
      <td colSpan={columns.length} className="text-center py-6 text-[#4B5563]">
        <span className="flex items-center justify-center text-lg text-gray-500 animate-pulse">
          <img src={loaderImg} alt="loader" className="w-20 h-20 animate-spin" />
        </span>
      </td>
    </tr>
  );

  const renderNoDataRow = () => (
    <tr>
      <td colSpan={columns.length} className="text-center py-8 text-[#4B5563]">
        No results found for the specified filter
      </td>
    </tr>
  );

  const renderTableRows = () => (
    paginatedData.map((row, rowIndex) => (
      <tr
        key={rowIndex}
        className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
        onClick={() => onRowClick && onRowClick(row)}
      >
        {columns.map((col) => (
          <td
            key={col.accessor}
            className="px-4 py-2 whitespace-nowrap text-center"
          >
            {col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
          </td>
        ))}
      </tr>
    ))
  );

  const renderMobileRows = () => (
    paginatedData.map((row, rowIndex) => (
      <div
        key={rowIndex}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-2 cursor-pointer"
        onClick={() => onRowClick && onRowClick(row)}
      >
        {columns.map((col) => (
          <div key={col.accessor} className="flex justify-between text-sm">
            <span className="text-gray-500 font-medium">{col.header}</span>
            <span className="text-gray-800 text-right">
              {col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
            </span>
          </div>
        ))}
      </div>
    ))
  );

  // Pagination button logic (simple, can be improved for large page counts)
  const getPaginationPages = () => {
    if (totalPages <= 4) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 2) return [1, 2, '...', totalPages];
    if (currentPage >= totalPages - 1) return [1, '...', totalPages - 1, totalPages];
    return [1, '...', currentPage, '...', totalPages];
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className={`relative space-y-4 shadow-md bg-white w-full rounded-lg ${containerClassName}`}>
        {/* Desktop Table */}
        <div className="items-center" style={{ maxHeight: '634px', minHeight: '400px', height: '634px' }}>
          <table className={`w-full ${tableClassName}`} style={{ minHeight: '100%', height: '100%' }}>
            <thead className="bg-[#F4F5F7] text-[#4B5563] w-full text-xs">
              <tr>
                {columns.map((col) => (
                  <th key={col.accessor} className="px-4 py-2 font-medium tracking-wide">
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-[#4B5563]">
              {isLoading
                ? renderLoaderRow()
                : paginatedData.length > 0
                  ? renderTableRows()
                  : renderNoDataRow()}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked View */}
        <div className="md:hidden space-y-4">
          {renderMobileRows()}
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="w-full flex justify-end">
          <div
            className="flex items-center !bg-white mt-4"
            style={{ border: "1px solid #E4E4E7", borderRadius: 0, width: 'fit-content' }}
          >
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center border-l !bg-white text-[#4B5563]"
              style={{ borderRadius: 0, border: "1px solid #E4E4E7" }}
            >
              &lt;
            </button>
            {getPaginationPages().map((page, idx) => (
              <button
                key={idx}
                disabled={page === '...'}
                onClick={() => handlePageClick(page)}
                className={`w-10 h-10 flex items-center justify-center !bg-white text-[#4B5563] ${page === currentPage ? 'font-bold bg-gray-100' : ''}`}
                style={{ borderRadius: 0, border: "1px solid #E4E4E7" }}
              >
                {page}
              </button>
            ))}
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="w-10 h-10 flex items-center justify-center !bg-white text-[#4B5563]"
              style={{ borderRadius: 0, border: "1px solid #E4E4E7" }}
            >
              &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
