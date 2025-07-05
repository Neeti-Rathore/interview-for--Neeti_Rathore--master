import  { useState } from "react";

export const Table = ({
  columns,
  currentData,
  containerClassName,
  tableClassName,
  isLoading = false,
  onRowClick,
}) => {
  const ITEMS_PER_PAGE = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(currentData.length / ITEMS_PER_PAGE);

  const paginatedData = currentData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };
  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div
          className={`relative space-y-4 shadow-md bg-white w-full rounded-lg ${containerClassName}`}
        >
          {/* Desktop Table */}
          <div className={`items-center overflow-x-auto`}>
            <table className={`w-full ${tableClassName}`}>
              <thead className="bg-[#F4F5F7] text-[#4B5563] w-full text-xs">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.accessor}
                      className="px-4 py-2 font-medium tracking-wide"
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="text-[#4B5563]">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="text-center py-6 text-[#4B5563]"
                    >
                      <span className="text-lg text-gray-500 animate-pulse">
                        Loading...
                      </span>
                    </td>
                  </tr>
                ) : paginatedData.length > 0 ? (
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
                          {col.render
                            ? col.render(row[col.accessor], row)
                            : row[col.accessor]}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="text-center py-8 text-[#4B5563]"
                    >
                      No results found for the specified filter
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked View */}
          <div className="md:hidden space-y-4">
            {paginatedData.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-2 cursor-pointer"
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((col) => (
                  <div
                    key={col.accessor}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-gray-500 font-medium">
                      {col.header}
                    </span>
                    <span className="text-gray-800 text-right">
                      {col.render
                        ? col.render(row[col.accessor], row)
                        : row[col.accessor]}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="w-full flex justify-end">
            <div
              className="flex items-center !bg-white mt-4"
              style={{
                border: "1px solid #E4E4E7",
                borderRadius: 0,
                width: 'fit-content',
              }}
            >
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className={`w-10 h-10 flex items-center justify-center border-l !bg-white text-[#4B5563] cursor-not-allowed`}
                style={{ borderRadius: 0, border: "1px solid #E4E4E7" }}
              >
                &lt;
              </button>

              {[1, 2, "...", totalPages].map((page, index) => (
                <button
                  key={index}
                  disabled={page === "..."}
                  onClick={() => typeof page === "number" && setCurrentPage(page)}
                  className={`w-10 h-10 flex items-center justify-center !bg-white text-[#4B5563]`}
                  style={{ borderRadius: 0, border: "1px solid #E4E4E7" }}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`w-10 h-10 flex items-center justify-center !bg-white text-[#4B5563]`}
                style={{ borderRadius: 0, border: "1px solid #E4E4E7" }}
              >
                &gt;
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
