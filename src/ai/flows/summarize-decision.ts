// src/ai/flows/summarize-decision.ts
'use server';

/**
 * @fileOverview A flow that summarizes key decisions from lengthy meeting notes into concise announcements.
 *
 * - summarizeDecision - A function that summarizes decisions for announcements.
 * - SummarizeDecisionInput - The input type for the summarizeDecision function.
 * - SummarizeDecisionOutput - The return type for the summarizeDecision function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeDecisionInputSchema = z.object({
  meetingNotes: z
    .string()
    .describe('The lengthy meeting notes to summarize key decisions from.'),
});
export type SummarizeDecisionInput = z.infer<typeof SummarizeDecisionInputSchema>;

const SummarizeDecisionOutputSchema = z.object({
  announcementSummary: z
    .string()
    .describe('A concise announcement summarizing the key decisions.'),
});
export type SummarizeDecisionOutput = z.infer<typeof SummarizeDecisionOutputSchema>;

export async function summarizeDecision(input: SummarizeDecisionInput): Promise<SummarizeDecisionOutput> {
  return summarizeDecisionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeDecisionPrompt',
  input: {schema: SummarizeDecisionInputSchema},
  output: {schema: SummarizeDecisionOutputSchema},
  prompt: `You are an AI assistant that summarizes key decisions from meeting notes into a concise announcement.

  Meeting Notes: {{{meetingNotes}}}

  Please provide a clear and concise announcement summarizing the key decisions made during the meeting.
  The announcement should be easily digestible for all members of the organization.`,
});

const summarizeDecisionFlow = ai.defineFlow(
  {
    name: 'summarizeDecisionFlow',
    inputSchema: SummarizeDecisionInputSchema,
    outputSchema: SummarizeDecisionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
