
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import type { CookieSerializeOptions } from 'cookie';

export async function GET(request: Request) {
  const cookieStore = cookies();
  const token = (await cookieStore).get('auth_token');
  const userId = (await cookieStore).get('id_user');

  if (!token) {
    return NextResponse.json({ success: false, message: 'Não autorizado: Token não encontrado.' }, { status: 401 });
  }
  
  if (!userId) {
    return NextResponse.json({ success: false, message: 'Não autorizado: ID do usuário não encontrado.' }, { status: 401 });
  }

  const webhookUrl = `http://localhost:5678/n8n/webhook/41250260-1ec9-47de-bc11-31fb3a6f56ae?user=${userId.value}`;

  try {
    const webhookResponse = await fetch(webhookUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json',
      },
    });

    if (!webhookResponse.ok) {
        const errorData = await webhookResponse.text();
        console.error("Webhook error response:", errorData);
        return NextResponse.json({ success: false, message: 'Falha ao buscar dados do perfil.' }, { status: webhookResponse.status });
    }

    // Refresh token logic via header
    const newAuthToken = webhookResponse.headers.get('X-Refreshed-Token');
    if (newAuthToken) {
        const cookieOptions: Partial<CookieSerializeOptions> = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 1 week
        };

        cookieStore.set('auth_token', newAuthToken, cookieOptions);
    }
    
    const responseBody = await webhookResponse.text();
    if (!responseBody) {
        return NextResponse.json({ success: false, message: 'Dados do perfil não encontrados.' }, { status: 404 });
    }
    
    const data = JSON.parse(responseBody);
    
    // The API returns an array, we'll take the first element
    const userProfile = data[0];

    if (!userProfile) {
         return NextResponse.json({ success: false, message: 'Dados do perfil não encontrados.' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: userProfile });

  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ success: false, message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}
