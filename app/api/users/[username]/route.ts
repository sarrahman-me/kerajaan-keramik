import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';

export async function GET(
  _: Request,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = await params;

    if (!username) {
      return NextResponse.json({ error: 'Username diperlukan' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('kerajaankeramik');
    const collection = db.collection('users');

    const user = await collection.findOne(
      { username },
      { projection: { password: 0 } } // Jangan kembalikan password
    );

    if (!user) {
      return NextResponse.json({ error: 'Pengguna tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ user });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: 'Gagal mengambil data pengguna: ' + error.message }, { status: 500 });
  }
}
