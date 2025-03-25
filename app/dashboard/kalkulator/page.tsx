import Kalkulator from "@/layouts/kalkulator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kalkulator Keramik",
};

export default function Page() {
  return (
    <div className="space-y-5">
      <div className="flex justify-between my-2 items-center">
        <h1 className="text-xl md:text-2xl font-bold">Kalkulator</h1>
      </div>

      <Kalkulator />
      <div className="bg-white border rounded-sm p-2 space-y-3">
        <p className="bg-secondary text-blue-900 py-1 px-2 rounded-sm font-medium text-lg">
          Rumus Perhitungan
        </p>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="font-semibold">Lantai:</p>
            <p>Diameter Ruangan: panjang × lebar</p>
            <p>
              Diameter Per Dus: (panjang keramik ÷ 100) × (lebar keramik ÷ 100)
              × (isi keramik per dus)
            </p>
            <p>Kebutuhan Keramik: ⌈diameter ruangan ÷ diameter per dus⌉</p>
          </div>

          <div className="space-y-2">
            <p className="font-semibold">Dinding:</p>
            <p>Diameter Ruangan: (2 × panjang + 2 × lebar) × tinggi</p>
            <p>
              Diameter Per Dus: (panjang keramik ÷ 100) × (lebar keramik ÷ 100)
              × (isi keramik per dus)
            </p>
            <p>Kebutuhan Keramik: ⌈diameter ruangan ÷ diameter per dus⌉</p>
            <p className="text-orange-600 text-xs md:text-sm">
              Saya ber asumsi dinding memiliki 4 sisi
            </p>
          </div>

          <div className="space-y-2">
            <p className="font-semibold">Isi Keramik per Dus:</p>
            <p>Keramik 25x25 memiliki isi per dus 16 pcs.</p>
            <p>Keramik 30x30 memiliki isi per dus 11 pcs.</p>
            <p>Keramik 40x40 memiliki isi per dus 6 pcs.</p>
            <p>Keramik 50x50 memiliki isi per dus 4 pcs.</p>
            <p>Keramik 60x60 memiliki isi per dus 4 pcs.</p>
            <p>Keramik 20x40 memiliki isi per dus 12 pcs.</p>
            <p>Keramik 25x40 memiliki isi per dus 10 pcs.</p>
            <p>Keramik 25x50 memiliki isi per dus 8 pcs.</p>
            <p>Keramik 30x60 memiliki isi per dus 6 pcs.</p>
            <p className="text-orange-600 text-xs md:text-sm">
              Jika kamu tidak menentukan isi keramik per dus, maka saya
              menggunakan isi keramik di atas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
