
import { NextResponse } from 'next/server';
import type { CookieSerializeOptions } from 'cookie';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'E-mail e senha são obrigatórios.' }, { status: 400 });
    }

    const webhookUrl = `http://n8n:5678/webhook/4c4483bb-8014-49b4-a903-10005fb5d0d7?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;

    const webhookResponse = await fetch(webhookUrl, {
      method: 'GET'
    });

    const result = await webhookResponse.json();

    if (!webhookResponse.ok || !result.success) {
       return NextResponse.json({ success: false, message: 'Credenciais inválidas.' }, { status: 401 });
    }

    const token = result.data?.token;
    const companyId = result.data?.id_company;

    if (!token) {
       return NextResponse.json({ success: false, message: 'Token não recebido.' }, { status: 500 });
    }
    
    if (companyId === undefined) {
        return NextResponse.json({ success: false, message: 'ID da empresa não recebido.' }, { status: 500 });
    }

    const response = NextResponse.json({ success: true });

    const cookieOptions: Partial<CookieSerializeOptions> = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    };

    // Set the token and company ID in HttpOnly cookies on the response
    response.cookies.set('auth_token', token, cookieOptions);
    response.cookies.set('company_id', String(companyId), cookieOptions);

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}
