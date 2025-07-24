
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'E-mail e senha são obrigatórios.' }, { status: 400 });
    }

    const webhookUrl = "http://localhost/n8n/webhook-test/4c4483bb-8014-49b4-a903-10005fb5d0d7";

    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await webhookResponse.json();

    if (!webhookResponse.ok || !result.success) {
       return NextResponse.json({ success: false, message: 'Credenciais inválidas.' }, { status: 401 });
    }

    const token = result.data.token;
    if (!token) {
       return NextResponse.json({ success: false, message: 'Token não recebido.' }, { status: 500 });
    }

    // Set the token in an HttpOnly cookie
    cookies().set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}
