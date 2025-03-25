"use client"
import Button from '@/components/button';
import SwitchToggle from '@/components/switchToggle';
import Textfield from '@/components/textfield';
import { useParams, useRouter } from 'next/navigation';
import { Loading, Notify } from 'notiflix';
import { FormEvent, useEffect, useState } from 'react';
import { FaArrowLeft } from "react-icons/fa6";

export default function Page() {
  const router = useRouter();
  const params = useParams<{ username: string; }>()
  const [data, setData] = useState({
    username: params.username || "",
    password: "",
    permissions: {
      canAdd: false,
      canEdit: false,
      canDelete: false
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!params.username) return;

    const fetchUser = async () => {
      try {
        Loading.standard();
        const response = await fetch(`/api/users/${params.username}`);
        const result = await response.json();

        if (!response.ok) throw new Error(result.error || "Gagal mengambil data pengguna");

        setData({
          username: result.username,
          password: "",
          permissions: result.permissions || { canAdd: false, canEdit: false, canDelete: false }
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        Notify.failure(err.message);
      } finally {
        Loading.remove();
      }
    };

    fetchUser();
  }, [params.username]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    Loading.standard();
    setLoading(true);
    setError("");

    try {
      const payload = {
        username: data.username,
        permissions: data.permissions,
        ...(data.password && { password: data.password }) // Hanya kirim password jika diisi
      };

      const response = await fetch('/api/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Gagal memperbarui data");

      Notify.success("Data pengguna berhasil diperbarui");
      router.push("/dashboard/pengguna");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      Notify.failure(err.message);
    } finally {
      Loading.remove();
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-2">
      <div className="flex my-2 items-center">
        <FaArrowLeft onClick={() => router.back()} className="text-xl md:text-2xl mr-4 cursor-pointer hover:text-blue-500" />
        <h1 className="text-xl md:text-2xl font-bold">Form Edit Pengguna</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 my-6 w-full md:w-1/2">
        <Textfield onChange={() => { }} value={data.username} label="Username" disabled />
        <Textfield type="password" onChange={(value) => setData({ ...data, password: value })} value={data.password} label="Password ( Hanya isi jika ingin mengganti )" />

        <p className="block text-sm md:text-base font-medium text-blue-700">Izin Akses</p>
        <SwitchToggle setValue={(value) => setData({ ...data, permissions: { ...data.permissions, canAdd: value } })} value={data.permissions.canAdd} label="Akses Tambah Data Barang" />
        <SwitchToggle setValue={(value) => setData({ ...data, permissions: { ...data.permissions, canEdit: value } })} value={data.permissions.canEdit} label="Akses Edit Data Barang" />
        <SwitchToggle setValue={(value) => setData({ ...data, permissions: { ...data.permissions, canDelete: value } })} value={data.permissions.canDelete} label="Akses Hapus Data Barang" />

        <Button fullWidth type="submit" disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan"}
        </Button>
      </form>
      {error && <p className="text-red-500 text-center">{error}</p>}
    </div>
  );
}
