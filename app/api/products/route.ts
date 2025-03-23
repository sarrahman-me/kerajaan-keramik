import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.DB_HOST || "";
const client = new MongoClient(uri);

export async function GET(req: Request) {
  try {
    await client.connect();
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
  } finally {
    await client.close();
  }
}
