import { NextResponse } from 'next/server';

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

export async function POST(request: Request) {
  console.log('Received Discord webhook request');
  
  if (!DISCORD_WEBHOOK_URL) {
    console.error('Missing DISCORD_WEBHOOK_URL');
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  try {
    const { message } = await request.json();
    console.log('Forwarding to Discord:', message);
    
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: message })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Discord API error:', response.status, error);
      throw new Error(`Discord API error: ${response.status}`);
    }

    console.log('Successfully sent to Discord');
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error in Discord webhook:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}
