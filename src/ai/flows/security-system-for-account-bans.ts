'use server';

/**
 * @fileOverview Implements a security system that monitors user activity,
 * detects suspicious behavior using AI, and bans accounts accordingly.
 *
 * - securitySystemCheck - A function that checks for suspicious activity and bans the user if necessary.
 * - SecuritySystemInput - The input type for the securitySystemCheck function.
 * - SecuritySystemOutput - The return type for the securitySystemCheck function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SecuritySystemInputSchema = z.object({
  username: z.string().describe('The username of the user.'),
  email: z.string().describe('The email of the user.'),
  activityLog: z.string().describe('Log of user activity including file access, network activity, etc.'),
});
export type SecuritySystemInput = z.infer<typeof SecuritySystemInputSchema>;

const SecuritySystemOutputSchema = z.object({
  isBanned: z.boolean().describe('Whether the account is banned or not.'),
  banReason: z.string().optional().describe('The reason for the ban, if applicable.'),
  banDuration: z.string().optional().describe('The duration of the ban, if applicable.'),
});
export type SecuritySystemOutput = z.infer<typeof SecuritySystemOutputSchema>;

export async function securitySystemCheck(input: SecuritySystemInput): Promise<SecuritySystemOutput> {
  return securitySystemFlow(input);
}

const securitySystemPrompt = ai.definePrompt({
  name: 'securitySystemPrompt',
  input: {schema: SecuritySystemInputSchema},
  output: {schema: SecuritySystemOutputSchema},
  prompt: `You are a security administrator that monitors user activity for suspicious behavior.

  Based on the user's activity log, determine if the account should be banned. 
  Consider factors like file access patterns, network activity (VPN, DNS), and potential harmful actions.

  Activity Log: {{{activityLog}}}

  Respond with whether the account should be banned, the reason for the ban, and the duration of the ban, if applicable.
  If the account is not banned, isBanned should be false and other fields should be omitted.
`,
});

const securitySystemFlow = ai.defineFlow(
  {
    name: 'securitySystemFlow',
    inputSchema: SecuritySystemInputSchema,
    outputSchema: SecuritySystemOutputSchema,
  },
  async input => {
    const {output} = await securitySystemPrompt(input);
    return output!;
  }
);
