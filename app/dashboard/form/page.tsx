"use client"
import Button from '@/components/button';
import SwitchToggle from '@/components/switchToggle';
import Textfield from '@/components/textfield';
import { useRouter } from 'next/navigation';
import { Loading, Notify } from 'notiflix';
import { FormEvent, useState } from 'react';
import { FaArrowLeft } from "react-icons/fa6";

export default function Page() {
  const router = useRouter();
  const [data, setData] = useState({
    nama: "",
    harga: 0,
    isPromo: false
  })
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    Loading.standard()
    setLoading(true);
    setError("");

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal menyimpan data");
      }

      Notify.success("Produk berhasil ditambahkan!");
      router.push("/dashboard");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      Notify.failure(err.message);
    } finally {
      Loading.remove()
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-2">
      <div className="flex my-2 items-center">
        <FaArrowLeft onClick={() => router.back()} className="text-xl md:text-2xl mr-4 cursor-pointer hover:text-blue-500" />
        <h1 className="text-xl md:text-2xl font-bold">Form Barang</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 my-6 w-full md:w-1/2">
        <Textfield onChange={(value) => setData({ ...data, nama: value })} value={data.nama} label="Nama Barang" />
        <Textfield type="number" onChange={(value) => setData({ ...data, harga: Number(value) })} value={data.harga} label="Harga" />
        <SwitchToggle setValue={(value) => setData({ ...data, isPromo: value })} value={data.isPromo} label="Promo" />
        <Button fullWidth type="submit" disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan"}
        </Button>
      </form>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <p className="text-center md:text-sm text-gray-500 mb-3">Dibuat dan dikelola oleh Rahman</p>
    </div>
  );
}
