'use client';

import { IProduct } from '@/interface/product';
import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Debounce untuk menunda request API saat user mengetik
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    setIsLoading(true); // Set loading sebelum fetch

    fetch(`/api/products?page=${currentPage}&limit=${itemsPerPage}&search=${encodeURIComponent(debouncedSearchTerm)}`, { signal })
      .then((res) => res.json())
      .then((result) => {
        setData(result.data);
        setTotalPages(result.totalPages);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      })
      .finally(() => setIsLoading(false)); // Set loading selesai

    return () => controller.abort();
  }, [currentPage, debouncedSearchTerm]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Produk Kerajaan Keramik</h1>

      {/* Search Input */}
      <input
        type="search"
        placeholder="Cari produk..."
        className="w-full p-2 border rounded mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">No</th>
              <th className="border p-2">Nama</th>
              <th className="border p-2">Harga</th>
              <th className="border p-2">Promo</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="text-center p-4">Loading...</td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-4 text-red-500">Produk tidak ditemukan</td>
              </tr>
            ) : (
              data.map((item: IProduct, index) => (
                <tr key={index}>
                  <td className="border p-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="border p-2">{item.nama}</td>
                  <td className="border p-2">Rp {item.harga}</td>
                  <td className="border p-2">{item.isPromo ? '✅' : '❌'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          <button
            className="px-4 py-2 border rounded disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>
          <button
            className="px-4 py-2 border rounded disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
