export async function sendDiscordWebhook(message: string): Promise<void> {
  console.log('Sending to Discord:', message);
  
  try {
    const response = await fetch('/api/discord', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    
    if (!response.ok) {
      const error = await response.text().catch(() => 'Failed to read error');
      console.error('Discord API error:', response.status, error);
    } else {
      console.log('Successfully sent to Discord');
    }
  } catch (error) {
    console.error('Error in sendDiscordWebhook:', error);
  }
}
