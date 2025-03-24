import DataTable from "@/layouts/dataTable";
import type { Metadata } from 'next'
import Link from "next/link";

export const metadata: Metadata = {
  title: "Halaman Barang - Kerajaan Keramik",
  description: "Toko keramik dan granit samarinda",
}

export default function Home() {
  return (
    <div className="container mx-auto p-2">
      <div className="flex justify-between my-2 items-center">
        <h1 className="text-xl md:text-2xl font-bold">Daftar Barang</h1>
        <Link href="/form" className="rounded p-1 md:p-2 bg-blue-500 text-white hover:shadow cursor-pointer text-sm md:text-base">Tambah Data</Link>
      </div>
      <DataTable />
      <p className="text-center md:text-sm text-gray-500 mb-3">Dibuat dan dikelola oleh Rahman</p>
    </div>
  );
}
