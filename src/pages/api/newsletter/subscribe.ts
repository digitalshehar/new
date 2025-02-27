import type { APIRoute } from 'astro';
import { z } from 'zod';

const subscribeSchema = z.object({
  email: z.string().email(),
});

export const post: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { email } = subscribeSchema.parse(data);

    // TODO: Integrate with your preferred email service provider
    // For example: Mailchimp, SendGrid, etc.
    
    // For now, we'll just simulate a successful subscription
    return new Response(
      JSON.stringify({
        message: 'Successfully subscribed to the newsletter!',
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to subscribe to the newsletter',
      }),
      { status: 400 }
    );
  }
};
