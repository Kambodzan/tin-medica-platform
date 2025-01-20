import React, { useState } from "react";

const TestTable = ({ type }) => {
  const tests = [
    { name: "Test 1", date: "2025-01-15", status: "In progress" },
    { name: "Test 2", date: "2025-01-16", status: "Finalized" },
    { name: "Test 3", date: "2025-01-17", status: "In progress" },
    { name: "Test 4", date: "2025-01-18", status: "Finalized" },
    { name: "Test 5", date: "2025-01-19", status: "In progress" },
    { name: "Test 6", date: "2025-01-20", status: "Finalized" },
  ];

  const prescriptions = [
    { date: "2025-01-10", meds: 3, status: "Completed" },
    { date: "2025-01-12", meds: 2, status: "Issued" },
    { date: "2025-01-14", meds: 5, status: "Completed" },
    { date: "2025-01-16", meds: 4, status: "Issued" },
  ];

  const data = type === "TEST" ? tests : prescriptions;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDetailsClick = (item) => {
    alert(`Details: ${JSON.stringify(item)}`);
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxButtons = 3;
    let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let end = Math.min(totalPages, start + maxButtons - 1);

    if (end - start + 1 < maxButtons) {
      start = Math.max(1, end - maxButtons + 1);
    }

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <div className="relative flex flex-col w-full h-full text-gray-700 bg-white rounded-lg bg-clip-border">
      <table className="w-full text-left table-auto min-w-max">
        <thead className="rounded-t-lg">
          <tr>
            {type === "TEST" ? (
              <>
                <th className="p-4 border-b border-slate-200 bg-slate-50 rounded-tl-lg">
                  <p className="text-sm font-normal leading-none text-slate-500">Test Code</p>
                </th>
                <th className="p-4 border-b border-slate-200 bg-slate-50">
                  <p className="text-sm font-normal leading-none text-slate-500">Test date</p>
                </th>
                <th className="p-4 border-b border-slate-200 bg-slate-50">
                  <p className="text-sm font-normal leading-none text-slate-500">Status</p>
                </th>
              </>
            ) : (
              <>
                <th className="p-4 border-b border-slate-200 bg-slate-50 rounded-tl-lg">
                  <p className="text-sm font-normal leading-none text-slate-500">Date of issue</p>
                </th>
                <th className="p-4 border-b border-slate-200 bg-slate-50">
                  <p className="text-sm font-normal leading-none text-slate-500">Medicine Quantity</p>
                </th>
                <th className="p-4 border-b border-slate-200 bg-slate-50">
                  <p className="text-sm font-normal leading-none text-slate-500">Status</p>
                </th>
              </>
            )}
            <th className="p-4 border-b border-slate-200 bg-slate-50 rounded-tr-lg">
              <p className="text-sm font-normal leading-none text-slate-500">Details</p>
            </th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr
              key={index}
              className="hover:bg-slate-50 border-b border-slate-200"
            >
              {type === "TEST" ? (
                <>
                  <td className="p-4 py-5 whitespace-normal break-words">
                    <p className="block font-semibold text-sm text-slate-800">{item.name}</p>
                  </td>
                  <td className="p-4 py-5">
                    <p className="text-sm text-slate-500">{item.date}</p>
                  </td>
                  <td className="p-4 py-5">
                    <p className="text-sm text-slate-500">{item.status}</p>
                  </td>
                </>
              ) : (
                <>
                  <td className="p-4 py-5">
                    <p className="text-sm text-slate-500">{item.date}</p>
                  </td>
                  <td className="p-4 py-5">
                    <p className="text-sm text-slate-500">{item.meds}</p>
                  </td>
                  <td className="p-4 py-5">
                    <p className="text-sm text-slate-500">{item.status}</p>
                  </td>
                </>
              )}
              <td className="p-4 py-5 text-right">
                <i
                  className="fa-solid fa-ellipsis-vertical text-2xl leading-none pt-3 cursor-pointer"
                  onClick={() => handleDetailsClick(item)}
                ></i>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center px-4 py-3">
        <div className="text-sm text-slate-500">
          Displayed <b>{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, data.length)}</b> z {data.length}
        </div>
        <div className="flex space-x-1">
          {currentPage > 1 && (
            <button
              onClick={() => paginate(currentPage - 1)}
              className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease"
            >
              Prev
            </button>
          )}
          {getPageNumbers().map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-3 py-1 min-w-9 min-h-9 text-sm font-normal ${
                currentPage === number
                  ? "text-white bg-slate-800 border border-slate-800 rounded hover:bg-slate-600 hover:border-slate-600"
                  : "text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400"
              } transition duration-200 ease`}
            >
              {number}
            </button>
          ))}
          {currentPage < totalPages && (
            <button
              onClick={() => paginate(currentPage + 1)}
              className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestTable;
