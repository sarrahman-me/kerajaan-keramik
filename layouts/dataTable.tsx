'use client';

import { IProduct } from '@/interface/product';
import { IPermissions } from '@/interface/profile';
import { formatCurrency } from '@/utils/formating';
import { useRouter } from 'next/navigation';
import { Confirm, Notify } from 'notiflix';
import { useEffect, useState } from 'react';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import { RxCross2 } from "react-icons/rx";

export default function DataTable({ permissions }: { permissions: IPermissions }) {
  const router = useRouter();
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

    setIsLoading(true);

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
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [currentPage, debouncedSearchTerm]);

  const handleDelete = async (nama: string) => {
    Confirm.show(
      'Konfirmasi',
      'Apakah Anda yakin ingin menghapus produk ini?',
      'Hapus',
      'Batal',
      async () => {
        try {
          const res = await fetch(`/api/products?nama=${nama}`, { method: 'DELETE' });
          const result = await res.json();

          if (res.ok) {
            setData((prevData) => prevData.filter((item: IProduct) => item.nama !== nama));
            Notify.success("Berhasil menghapus data");
          } else {
            Notify.failure(result.error || 'Gagal menghapus produk');
          }
        } catch (error) {
          console.error('Gagal menghapus produk:', error);
        }
      },
      () => { },
      { okButtonBackground: "red", titleColor: "red" },
    );

  };

  return (
    <div>
      <input
        type="search"
        placeholder="Cari produk..."
        className="w-full p-2 border rounded mb-4 bg-white"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-300">
              <th className="border p-2">No</th>
              <th className="border p-2">Nama</th>
              <th className="border p-2">Harga</th>
              <th className="border p-2">Promo</th>
              {permissions.canDelete || permissions.canEdit ? (
                <th className="border p-2">Aksi</th>
              ) : null}
            </tr>
          </thead>
          <tbody className="bg-white">
            {isLoading ? (
              <tr>
                <td colSpan={permissions.canEdit || permissions.canDelete ? 5 : 4} className="text-center p-4">Loading...</td>
              </tr>
            ) : data?.length === 0 ? (
              <tr>
                <td colSpan={permissions.canEdit || permissions.canDelete ? 5 : 4} className="text-center p-4 text-red-500">Produk tidak ditemukan</td>
              </tr>
            ) : (
              data?.map((item: IProduct, index) => (
                <tr key={index} className="text-sm md:text-base">
                  <td className="border p-1 md:p-2 text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="border p-1 md:p-2">{item.nama}</td>
                  <td className="border p-1 md:p-2">{formatCurrency(item.harga)}</td>
                  <td className="border p-1 md:p-2 text-center place-items-center">{item.isPromo ? '✅' : <RxCross2 />}</td>
                  {permissions.canDelete || permissions.canEdit ? (
                    <td className="border p-1 md:p-2 text-center">
                      <div className="flex justify-around items-center">
                        {permissions.canEdit && (
                          <button
                            onClick={() => router.push(`/dashboard/barang/${encodeURIComponent(item.nama)}/edit`)}
                            className="cursor-pointer mr-5 text-orange-500 hover:text-orange-700"
                          >
                            <FaPencilAlt />
                          </button>

                        )}
                        {permissions.canDelete && (
                          <button
                            onClick={() => handleDelete(encodeURIComponent(item.nama))}
                            className="cursor-pointer text-red-500 hover:text-red-700"
                          >
                            <FaTrashAlt />
                          </button>
                        )}
                      </div>
                    </td>

                  ) : null}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          <button
            className="bg-white cursor-pointer hover:shadow disabled:shadow-none px-4 py-2 border rounded disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>
          <button
            className="bg-white cursor-pointer hover:shadow disabled:hover:shadow-none px-4 py-2 border rounded disabled:opacity-50"
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
