const DISCORD_WEBHOOK_URL = '/api/discord';

export async function sendDiscordWebhook(message: string): Promise<void> {
  try {
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to send notification');
    }
  } catch (error) {
    console.error('Error sending notification:', error);
    // Don't throw the error to prevent blocking the UI
  }
}
