// app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return new NextResponse('User with this email already exists', { status: 409 });
    }

    // Mocked password hash for demo (replace with bcrypt in production)
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: `mock-hashed-${password}`, 
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Registration Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}