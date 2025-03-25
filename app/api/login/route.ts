import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const SECRET_KEY = process.env.JWT_SECRET || "DefaultKey"

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username dan password harus diisi' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('kerajaankeramik');
    const collection = db.collection('users');

    // Cari user berdasarkan username
    const user = await collection.findOne({ username });

    if (!user) {
      return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 });
    }

    // Verifikasi password dengan bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 });
    }

    // Buat token JWT
    const token = jwt.sign(
      { username: user.username, permissions: user.permissions },
      SECRET_KEY,
      { expiresIn: '1h' } // Token berlaku selama 1 jam
    );

    // Simpan token di cookie HTTPOnly
    const response = NextResponse.json({ message: 'Login berhasil' });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600, // 1 jam
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Terjadi kesalahan pada server' + error }, { status: 500 });
  }
}
