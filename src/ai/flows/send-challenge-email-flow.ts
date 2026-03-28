'use server';
/**
 * @fileOverview Elite Challenge Notification Flow.
 * 
 * This flow is responsible for composing and "sending" high-stakes notification emails
 * when a playmaker launches a new challenge in the arena.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SendChallengeEmailInputSchema = z.object({
  challengerName: z.string().describe('The name of the playmaker issuing the challenge.'),
  opponentEmail: z.string().email().describe('The email address of the targeted opponent.'),
  sport: z.string().describe('The arena/sport the challenge is taking place in.'),
  eventName: z.string().describe('The specific event or matchup.'),
  stakes: z.string().describe('The entry fee and currency (e.g., "1,000 SC").'),
  inviteCode: z.string().describe('The unique arena access code.'),
});

export type SendChallengeEmailInput = z.infer<typeof SendChallengeEmailInputSchema>;

const SendChallengeEmailOutputSchema = z.object({
  success: z.boolean().describe('Whether the notification was successfully processed.'),
  message: z.string().describe('A confirmation message or error details.'),
  emailPreview: z.object({
    subject: z.string(),
    body: z.string(),
  }).optional(),
});

export type SendChallengeEmailOutput = z.infer<typeof SendChallengeEmailOutputSchema>;

/**
 * Composes and "sends" an elite challenge notification email.
 * In this prototype, it generates the email content and simulates the delivery.
 */
export async function sendChallengeEmail(input: SendChallengeEmailInput): Promise<SendChallengeEmailOutput> {
  return sendChallengeEmailFlow(input);
}

const emailPrompt = ai.definePrompt({
  name: 'composeChallengeEmail',
  input: { schema: SendChallengeEmailInputSchema },
  output: { 
    schema: z.object({
      subject: z.string(),
      body: z.string(),
    })
  },
  prompt: `You are the Playmakers Arena announcer. Your job is to compose a high-impact, aggressive, and elite email notification for a new sports challenge.

The tone should be professional yet competitive, like a high-stakes Vegas sportsbook.

Input Details:
- Challenger: {{{challengerName}}}
- Opponent Email: {{{opponentEmail}}}
- Arena: {{{sport}}}
- Event: {{{eventName}}}
- Stakes: {{{stakes}}}
- Invite Code: {{{inviteCode}}}

Instructions:
1. Create a subject line that demands attention (e.g., "ARENA ALERT: You've been challenged by {{{challengerName}}}").
2. The body should mention the specific event and the stakes involved.
3. Use terms like "Arena", "Showdown", "Playmaker", and "Locked In".
4. Include a clear call to action to enter the invite code.`,
});

const sendChallengeEmailFlow = ai.defineFlow(
  {
    name: 'sendChallengeEmailFlow',
    inputSchema: SendChallengeEmailInputSchema,
    outputSchema: SendChallengeEmailOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await emailPrompt(input);

      if (!output) {
        throw new Error('Failed to compose email content.');
      }

      // SIMULATION: In a production environment, this is where you would call 
      // an API like SendGrid, Postmark, or Resend.
      console.log(`[ARENA NOTIFICATION] Sending email to ${input.opponentEmail}...`);
      console.log(`Subject: ${output.subject}`);
      
      return {
        success: true,
        message: `Challenge notification queued for ${input.opponentEmail}`,
        emailPreview: output,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to process arena notification.',
      };
    }
  }
);
