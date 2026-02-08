
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

  const webhookUrl = `http://n8n:5678/webhook/41250260-1ec9-47de-bc11-31fb3a6f56ae?user=${userId.value}`;

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

        (await cookieStore).set('auth_token', newAuthToken, cookieOptions);
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


export async function PATCH(request: Request) {
    const cookieStore = cookies();
    const token = (await cookieStore).get('auth_token');
    const userId = (await cookieStore).get('id_user');

    if (!token || !userId) {
        return NextResponse.json({ success: false, message: 'Não autorizado.' }, { status: 401 });
    }

    try {
        const body = await request.json();

        // N8N webhook URL for updating profile
        const webhookUrl = "http://n8n:5678/webhook/857f9f2b-dad9-4e98-9292-c62198d549d7";

        const webhookResponse = await fetch(webhookUrl, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token.value}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...body, id_user: userId.value }), // Forwarding body and ensuring user id is present
        });

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
            (await cookieStore).set('auth_token', newAuthToken, cookieOptions);
        }

        if (!webhookResponse.ok) {
            const errorData = await webhookResponse.json().catch(() => ({ message: 'Falha ao atualizar o perfil. O serviço de destino não respondeu corretamente.' }));
            return NextResponse.json({ success: false, message: errorData.message }, { status: webhookResponse.status });
        }
        
        const result = await webhookResponse.json();

        return NextResponse.json({ success: true, data: result });

    } catch (error) {
        console.error('Profile update error:', error);
        return NextResponse.json({ success: false, message: 'Ocorreu um erro no servidor ao atualizar o perfil.' }, { status: 500 });
    }
}
