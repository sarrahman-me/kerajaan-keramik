"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/button";
import SwitchToggle from "@/components/switchToggle";
import Textfield from "@/components/textfield";
import { Loading, Notify } from "notiflix";
import { FaArrowLeft } from "react-icons/fa6";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams<{ nama: string; }>()

  const [data, setData] = useState({
    nama: "",
    harga: 0,
    isPromo: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch product data
  useEffect(() => {
    if (!params.nama) return;

    const fetchData = async () => {
      Loading.standard();
      try {
        const response = await fetch(`/api/products/${params.nama}`);
        const result = await response.json();

        console.log(result)

        if (!response.ok) {
          throw new Error(result.error || "Gagal mengambil data produk");
        }

        setData({
          nama: result.nama,
          harga: result.harga,
          isPromo: result.isPromo || false,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message);
        Notify.failure(err.message);
      } finally {
        Loading.remove();
      }
    };

    fetchData();
  }, [params.nama]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    Loading.standard();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/products/${params.nama}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ harga: data.harga, isPromo: data.isPromo }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Gagal memperbarui produk");
      }

      Notify.success("Produk berhasil diperbarui!");
      router.push("/dashboard");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
      Notify.failure(err.message);
    } finally {
      Loading.remove();
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-2">
      <div className="flex my-2 items-center">
        <FaArrowLeft
          onClick={() => router.back()}
          className="text-xl md:text-2xl mr-4 cursor-pointer hover:text-blue-500"
        />
        <h1 className="text-xl md:text-2xl font-bold">Edit Barang</h1>
      </div>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6 my-6 w-full md:w-1/2">
        <Textfield onChange={() => { }} value={data.nama} label="Nama Barang" disabled />
        <Textfield
          type="number"
          onChange={(value) => setData({ ...data, harga: Number(value) })}
          value={data.harga}
          label="Harga"
        />
        <SwitchToggle
          setValue={(value) => setData({ ...data, isPromo: value })}
          value={data.isPromo}
          label="Promo"
        />
        <Button fullWidth type="submit" disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </form>
    </div>
  );
}
