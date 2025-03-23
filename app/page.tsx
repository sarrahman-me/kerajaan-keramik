import DataTable from "@/layouts/dataTable";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Halaman Barang - Kerajaan Keramik",
  description: "Toko keramik dan granit samarinda",
}

export default function Home() {
  return (
    <div>
      <DataTable />
      <p className="text-center md:text-sm text-gray-500 mb-3">Dibuat dan dikelola oleh Rahman</p>
    </div>
  );
}
