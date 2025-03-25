'use client';

import { useEffect, useState } from 'react';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import { Confirm, Notify } from 'notiflix';
import { RxCross2 } from 'react-icons/rx';
import { IUser } from '@/interface/user';
import { useRouter } from 'next/navigation';

export default function UserTable() {
  const router = useRouter()
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/users')
      .then((res) => res.json())
      .then((result) => {
        setUsers(result.users);
      })
      .catch((err) => console.error('Gagal mengambil data pengguna:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleDelete = async (username: string) => {
    Confirm.show(
      'Konfirmasi',
      `Apakah Anda yakin ingin menghapus pengguna ${username}?`,
      'Hapus',
      'Batal',
      async () => {
        try {
          const res = await fetch(`/api/users?username=${username}`, { method: 'DELETE' });
          const result = await res.json();

          if (res.ok) {
            setUsers((prevUsers) => prevUsers.filter((user) => user.username !== username));
            Notify.success(`Pengguna '${username}' berhasil dihapus`);
          } else {
            Notify.failure(result.error || 'Gagal menghapus pengguna');
          }
        } catch (error) {
          console.error('Gagal menghapus pengguna:', error);
        }
      },
      () => { },
      { okButtonBackground: 'red', titleColor: 'red' }
    );
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-300">
              <th className="border p-2">No</th>
              <th className="border p-2">Username</th>
              <th className="border p-2">Izin Tambah</th>
              <th className="border p-2">Izin Edit</th>
              <th className="border p-2">Izin Hapus</th>
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center p-4">Loading...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-4 text-red-500">Tidak ada pengguna</td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={index} className="text-sm md:text-base">
                  <td className="border p-1 md:p-2 text-center">{index + 1}</td>
                  <td className="border p-1 md:p-2">{user.username}</td>
                  <td className="border p-1 md:p-2 text-center place-items-center">{user.permissions.canAdd ? '✅' : <RxCross2 />}</td>
                  <td className="border p-1 md:p-2 text-center place-items-center">{user.permissions.canEdit ? '✅' : <RxCross2 />}</td>
                  <td className="border p-1 md:p-2 text-center place-items-center">{user.permissions.canDelete ? '✅' : <RxCross2 />}</td>
                  <td className="border p-1 md:p-2 text-center">
                    <div className="flex justify-around items-center">
                      <button
                        onClick={() => router.push(`/dashboard/pengguna/${user.username}/edit`)}
                        className="cursor-pointer mr-5 text-orange-500 hover:text-orange-700"
                      >
                        <FaPencilAlt />
                      </button>
                      {user.username !== 'superadmin' && (
                        <button
                          onClick={() => handleDelete(user.username)}
                          className="cursor-pointer text-red-500 hover:text-red-700"
                        >
                          <FaTrashAlt />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
