import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';

interface Context {
  params: { nama: string };
}

// GET Single Product by Nama
export async function GET(req: Request, context: Context) {
  try {
    const { nama } = context.params;
    const client = await clientPromise;
    const db = client.db('kerajaankeramik');
    const collection = db.collection('products');

    const product = await collection.findOne({ nama });

    if (!product) {
      return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data produk: ' + error }, { status: 500 });
  }
}

// PATCH Edit Product by Nama
export async function PATCH(req: Request, context: Context) {
  try {
    const { nama } = context.params;
    const client = await clientPromise;
    const db = client.db('kerajaankeramik');
    const collection = db.collection('products');

    const updates = await req.json();
    if (!updates || Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'Data perubahan tidak boleh kosong' }, { status: 400 });
    }

    const result = await collection.updateOne(
      { nama },
      { $set: { ...updates, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ message: `Produk '${nama}' berhasil diperbarui` });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal memperbarui produk: ' + error }, { status: 500 });
  }
}
