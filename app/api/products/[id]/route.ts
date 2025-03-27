import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/db';

// GET Single Product by ID
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db('kerajaankeramik');
    const collection = db.collection('products');

    const product = await collection.findOne({ _id: new ObjectId(id) });

    if (!product) {
      return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data produk: ' + error }, { status: 500 });
  }
}

// PATCH Edit Product by ID
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db('kerajaankeramik');
    const collection = db.collection('products');

    const updates = await req.json();
    if (!updates || Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'Data perubahan tidak boleh kosong' }, { status: 400 });
    }

    // Cek apakah nama baru sudah digunakan oleh produk lain
    if (updates.nama) {
      const existingProduct = await collection.findOne({ nama: updates.nama });
      if (existingProduct && existingProduct._id.toString() !== id) {
        return NextResponse.json({ error: 'Nama produk sudah digunakan' }, { status: 400 });
      }
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ message: `Produk dengan ID '${id}' berhasil diperbarui` });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal memperbarui produk: ' + error }, { status: 500 });
  }
}
