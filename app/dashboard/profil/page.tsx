import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

interface ProfileData {
  username: string;
  permissions: {
    canAdd: boolean;
    canEdit: boolean;
    canDelete: boolean;
  };
  iat: number;
  exp: number;
}

export default async function Profile() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return <div className="text-red-600 text-center mt-10">Token tidak ditemukan. Silakan login kembali.</div>;
  }

  const profile: ProfileData = jwtDecode(token);

  return (
    <div>
      <div className="flex justify-between my-2 items-center">
        <h1 className="text-xl md:text-2xl font-bold">Profil Pengguna</h1>
      </div>

      <div className="bg-white rounded p-6 border">
        <div className="space-y-3">
          <p className="text-gray-700">
            <span className="font-semibold">Username:</span> {profile.username}
          </p>
          <p className="text-gray-700 font-semibold">Izin Akses:</p>
          <ul className="list-disc list-inside text-gray-700">
            <li>Tambah Barang: {profile.permissions.canAdd ? "✅ Ya" : "❌ Tidak"}</li>
            <li>Edit Barang: {profile.permissions.canEdit ? "✅ Ya" : "❌ Tidak"}</li>
            <li>Hapus Barang: {profile.permissions.canDelete ? "✅ Ya" : "❌ Tidak"}</li>
          </ul>
        </div>
      </div>

    </div>
  );
}
