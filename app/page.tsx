'use client';
import { IProduct } from '@/interface/product';
import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((result) => setData(result))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Data dari MongoDB</h1>
      <ul>
        {data.map((item: IProduct, index) => (
          <div key={index} className="border m-1 rounded p-1">
            <li>Nama: {item.nama}</li>
            <li>Harga: {item.harga}</li>
            <li>{item.isPromo ? "Promo" : "tidak"}</li>
          </div>
        ))}
      </ul>
    </div>
  );
}
