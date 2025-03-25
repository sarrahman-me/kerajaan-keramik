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

    // Buat token JWT dengan masa berlaku 1 hari
    const token = jwt.sign(
      { username: user.username, permissions: user.permissions },
      SECRET_KEY,
      { expiresIn: '1d' } // Token berlaku selama 1 hari
    );

    // Simpan token di cookie HTTPOnly dengan masa berlaku 1 hari
    const response = NextResponse.json({ message: 'Login berhasil' });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 86400, // 1 hari dalam detik (24 jam * 60 menit * 60 detik)
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Terjadi kesalahan pada server' + error }, { status: 500 });
  }
}
