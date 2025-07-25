
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields if necessary, though Zod on the client helps
    const { email, password, document, documentType } = body;
    if (!email || !password || !document || !documentType) {
      return NextResponse.json({ success: false, message: 'Campos obrigatórios ausentes.' }, { status: 400 });
    }

    const webhookUrl = "http://localhost/n8n/webhook-test/249f5143-8a57-401c-a888-f398485ca797";

    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!webhookResponse.ok) {
       const errorData = await webhookResponse.json();
       return NextResponse.json({ success: false, message: errorData.message || 'Falha ao se comunicar com o serviço de cadastro.' }, { status: webhookResponse.status });
    }
    
    const result = await webhookResponse.json();

    return NextResponse.json({ success: true, data: result });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ success: false, message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}

    