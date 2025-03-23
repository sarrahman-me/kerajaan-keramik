import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.DB_HOST || "";
const client = new MongoClient(uri);

export async function GET() {
  try {
    await client.connect();
    const db = client.db('kerajaankeramik');
    const collection = db.collection('products');
    const data = await collection.find({}).toArray();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data' + error }, { status: 500 });
  } finally {
    await client.close();
  }
}
