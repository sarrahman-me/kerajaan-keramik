'use client';

import { IProduct } from '@/interface/product';
import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetch(`/api/products?page=${currentPage}&limit=${itemsPerPage}`)
      .then((res) => res.json())
      .then((result) => {
        setData(result.data);
        setTotalPages(result.totalPages);
      })
      .catch((err) => console.error(err));
  }, [currentPage]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Produk Kerajaan Keramik</h1>
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
            {data.map((item: IProduct, index) => (
              <tr key={index}>
                <td className="border p-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td className="border p-2">{item.nama}</td>
                <td className="border p-2">Rp {item.harga}</td>
                <td className="border p-2">{item.isPromo ? '✅' : '❌'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
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
    </div>
  );
}
