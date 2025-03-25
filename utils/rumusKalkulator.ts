export interface kalkulatorInterface {
  tipe: string;
  ukuran: string;
  panjang: number;
  lebar: number;
  tinggi: number;
  isi?: number;
}

// Objek yang berisi informasi ukuran keramik dan isi per dus jika input tidak ada
const ukuranKeramikInfo: Record<string, number> = {
  "20x20": 25,
  "20x25": 20,
  "25x25": 16,
  "30x30": 11,
  "40x40": 6,
  "50x50": 4,
  "60x60": 4,
  "20x40": 12,
  "25x40": 10,
  "25x50": 8,
  "30x60": 6,
  "60x120": 2,
};

const RumusKalkulator = ({
  panjang,
  lebar,
  tinggi,
  isi,
  tipe,
  ukuran,
}: kalkulatorInterface) => {
  const result = {
    diameter_ruang: 0,
    kebutuhan: 0,
    diameter_perdus: 0,
    isi: 0,
  };

  // perhitungan untuk lantai

  if (tipe === "Lantai") {
    // mengukur diameter ruangan
    result.diameter_ruang = Number((panjang * lebar).toFixed(2));

    // mengambil isi per dus
    result.isi = ukuranKeramikInfo[ukuran];

    // mengukur diameter per dus
    result.diameter_perdus =
      (parseInt(ukuran.split("x")[0]) / 100) *
      (parseInt(ukuran.split("x")[1]) / 100) *
      (isi || result.isi);

    // menghitung kebutuhan keramik
    result.kebutuhan = Math.ceil(
      result.diameter_ruang / result.diameter_perdus
    );

    // perhitungan untuk lantai
  } else if (tipe === "Dinding") {
    // mengukur diameter ruang

    result.diameter_ruang = Number(
      ((panjang + panjang + lebar + lebar) * tinggi).toFixed(2)
    );

    // mengambil isi per dus
    result.isi = ukuranKeramikInfo[ukuran];

    // mengukur diameter per dus
    result.diameter_perdus =
      (parseInt(ukuran.split("x")[0]) / 100) *
      (parseInt(ukuran.split("x")[1]) / 100) *
      (isi || result.isi);

    // menghitung kebutuhan keramik
    result.kebutuhan = Math.ceil(
      result.diameter_ruang / result.diameter_perdus
    );

    // handle wrong input
  } else {
    console.error("perhitungan gagal karena input tidak sesuai");
  }

  // mengembalikan result yang sesuai
  return result;
};

export default RumusKalkulator;
