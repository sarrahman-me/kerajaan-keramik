"use client";
import Button from "@/components/button";
import RumusKalkulator, { kalkulatorInterface } from "@/utils/rumusKalkulator";
import { FormEvent, useState } from "react";
import InputGroup from "./inputGroup";
import DisplayData from "@/components/displayData";

const Kalkulator = () => {
  const [payload, setPayload] = useState<kalkulatorInterface>({
    panjang: 0,
    lebar: 0,
    tinggi: 0,
    isi: 0,
    tipe: "",
    ukuran: "",
  });
  const [result, setResult] = useState<{
    diameter_ruang: number;
    kebutuhan: number;
    diameter_perdus: number;
    isi: number;
  }>({ diameter_ruang: 0, kebutuhan: 0, diameter_perdus: 0, isi: 0 });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const hasilPerhitungan = RumusKalkulator({
      ...payload,
      panjang: Number(payload.panjang),
      lebar: Number(payload.lebar),
      tinggi: Number(payload.tinggi),
      isi: Number(payload.isi),
    });

    setResult(hasilPerhitungan);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <form onSubmit={handleSubmit} className={`space-y-5`}>
        <InputGroup
          forms={[
            {
              type: "select",
              staticData: true,
              lists: [{ tipe: "Lantai" }, { tipe: "Dinding" }],
              label: "Tipe",
              name: "tipe",
              placeholder: "Pilih Tipe...",
              keyValue: {
                key: "tipe",
                value: "tipe",
              },
            },
            {
              type: "select",
              staticData: true,
              lists: [
                { nama: "20x20" },
                { nama: "20x25" },
                { nama: "25x25" },
                { nama: "30x30" },
                { nama: "40x40" },
                { nama: "50x50" },
                { nama: "60x60" },
                { nama: "20x40" },
                { nama: "25x40" },
                { nama: "25x50" },
                { nama: "30x60" },
                { nama: "60x120" },
              ],
              label: "Ukuran",
              name: "ukuran",
              placeholder: "Pilih Ukuran...",
              keyValue: {
                key: "nama",
                value: "nama",
              },
            },
            {
              type: "number",
              label: "Panjang",
              name: "panjang",
            },
            {
              type: "number",
              label: "Lebar",
              name: "lebar",
            },
            {
              type: "number",
              label: "Tinggi",
              name: "tinggi",
              disabled: payload.tipe !== "Dinding",
            },
            {
              type: "number",
              label: "Isi Per Dus (Opsional)",
              name: "isi",
            },
          ]}
          setData={(values) => setPayload({ ...payload, ...values })}
          data={payload}
        />
        <Button fullWidth type="submit">
          Hitung
        </Button>
      </form>

      {/* hasil perhitungan */}
      <div className="bg-white border rounded-sm p-1 md:p-2 space-y-3">
        <p className="bg-secondary text-primary-900 p-0.5 rounded-sm font-medium text-lg">
          Hasil Perhitungan
        </p>
        <DisplayData title="Kebutuhan" data={`${result.kebutuhan || 0} Dus`} />
        <DisplayData
          title="Diameter Per Dus"
          data={`${result.diameter_perdus.toFixed(2) || 0} m`}
        />
        <DisplayData
          title="Isi Per Dus"
          data={`${result.isi.toFixed(0) || 0} pcs`}
        />
        <DisplayData
          title="Diameter Ruangan"
          data={`${result.diameter_ruang.toFixed(2) || 0} m`}
        />
      </div>
    </div>
  );
};

export default Kalkulator;
