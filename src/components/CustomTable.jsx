import { useState, useEffect } from "react";
import Pagination from "./Pagination";
import { Td, Th } from "../ReusableComponents/Table";

const CustomTable = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [paginate, setPaginate] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch data from the API
  const fetchData = async (page = 1, search = "", rowsPerPage = 10) => {
    setLoading(true); // Set loading to true
    setError(null); // Reset any previous errors
    try {
      const response = await fetch(
        `https://api.razzakfashion.com/?paginate=${rowsPerPage}&search=${search}&page=${page}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result = await response.json();

      console.log("Fetched data:", result); // Log the response data for debugging

      setData(result.data); // Set fetched data to state
      setTotalItems(result.total); // Set the total item count
      setTotalPages(result.last_page); // Set the total number of pages
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message); // Set error message
    } finally {
      setLoading(false); // Set loading to false once the API call is complete
    }
  };

  // Fetch data when component mounts or pagination/search/rowsPerPage changes
  useEffect(() => {
    fetchData(paginate, search, rowsPerPage);
  }, [paginate, search, rowsPerPage]);

  return (
    <div className="p-6">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPaginate(1);
        }}
        className="p-2 mb-4 w-full sm:w-1/4 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Error Handling */}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Loading State */}
      {loading && <div>Loading...</div>}

      {/* Table */}
      {!loading && !error && (
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Created At</Th>
              <Th>Updated At</Th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-b">
                <Td>{item.id}</Td>
                <Td>{item.name}</Td>
                <Td>{item.email}</Td>
                <Td>{new Date(item.created_at).toLocaleString()}</Td>
                <Td> {new Date(item.updated_at).toLocaleString()}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination Controls */}
      <Pagination
        currentPage={paginate}
        totalPages={totalPages}
        totalItems={totalItems}
        rowsPerPage={rowsPerPage}
        onPageChange={setPaginate}
        onRowsPerPageChange={setRowsPerPage}
      />
    </div>
  );
};

export default CustomTable;
