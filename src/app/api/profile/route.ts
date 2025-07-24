
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token');

  if (!token) {
    return NextResponse.json({ success: false, message: 'Não autorizado' }, { status: 401 });
  }

  const webhookUrl = "http://localhost/n8n/webhook-test/41250260-1ec9-47de-bc11-31fb3a6f56ae";

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

    const data = await webhookResponse.json();
    
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
