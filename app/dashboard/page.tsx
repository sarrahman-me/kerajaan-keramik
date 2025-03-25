import { IProfileData } from "@/interface/profile";
import DataTable from "@/layouts/dataTable";
import { jwtDecode } from "jwt-decode";
import type { Metadata } from 'next'
import { cookies } from "next/headers";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Halaman Barang - Kerajaan Keramik",
  description: "Toko keramik dan granit samarinda",
}

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return <div className="text-red-600 text-center mt-10">Token tidak ditemukan. Silakan login kembali.</div>;
  }

  const profile: IProfileData = jwtDecode(token);

  return (
    <div className="container mx-auto p-2">
      <div className="flex justify-between my-2 items-center">
        <h1 className="text-xl md:text-2xl font-bold">Daftar Barang</h1>
        {profile.permissions.canAdd && (<Link href="/dashboard/form" className="rounded p-1 md:p-2 bg-blue-600 text-white hover:shadow cursor-pointer text-sm md:text-base">Tambah Data</Link>
        )}
      </div>
      <DataTable permissions={profile.permissions} />
    </div>
  );
}
