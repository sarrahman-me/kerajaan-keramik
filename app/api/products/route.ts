import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';

export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db('kerajaankeramik');
    const collection = db.collection('products');

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '5', 10);
    const search = searchParams.get('search') || '';

    const query = search ? { nama: { $regex: search, $options: 'i' } } : {};
    const totalItems = await collection.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    const data = await collection.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return NextResponse.json({ data, totalPages });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data: ' + error }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db('kerajaankeramik');
    const collection = db.collection('products');

    const body = await req.json();
    if (!body.nama) {
      return NextResponse.json({ error: 'Nama harus diisi' }, { status: 400 });
    }

    const existingProduct = await collection.findOne({ nama: body.nama });
    if (existingProduct) {
      return NextResponse.json({ error: 'Nama produk sudah ada' }, { status: 400 });
    }

    const result = await collection.insertOne(body);
    return NextResponse.json({ message: 'Produk berhasil ditambahkan', id: result.insertedId });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menambahkan produk: ' + error }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db('kerajaankeramik');
    const collection = db.collection('products');

    const { searchParams } = new URL(req.url);
    const nama = searchParams.get('nama');

    if (!nama) {
      return NextResponse.json({ error: 'Nama produk diperlukan untuk menghapus' }, { status: 400 });
    }

    const result = await collection.deleteOne({ nama });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ message: `Produk '${nama}' berhasil dihapus` });
  } catch (error) {
    console.error("Error saat menghapus produk:", error);
    return NextResponse.json({ error: 'Gagal menghapus produk: ' + error }, { status: 500 });
  }
}
