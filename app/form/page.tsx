"use client"
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from "react-icons/fa6";

export default function Page() {
  const router = useRouter();

  return (
    <div className="container mx-auto p-2">
      <div className="flex my-2 items-center">
        <FaArrowLeft onClick={() => router.back()} className="text-xl md:text-2xl mr-4 cursor-pointer hover:text-blue-500" />
        <h1 className="text-xl md:text-2xl font-bold">Form Barang</h1>
      </div>
      <p className="text-center md:text-sm text-gray-500 mb-3">Dibuat dan dikelola oleh Rahman</p>
    </div>
  );
}
