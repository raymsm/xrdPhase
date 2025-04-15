// src/ai/flows/suggest-structures.ts
'use server';

/**
 * @fileOverview Suggests potential matching crystal structures for a given XRD data file.
 *
 * - suggestStructures - A function that suggests potential matching crystal structures.
 * - SuggestStructuresInput - The input type for the suggestStructures function.
 * - SuggestStructuresOutput - The return type for the suggestStructures function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {FileContent} from '@/services/file-upload';

const SuggestStructuresInputSchema = z.object({
  file: z.object({
    filename: z.string().describe('The name of the XRD data file.'),
    data: z.string().describe('The content of the XRD data file.'),
  }).describe('The XRD data file to analyze.'),
  elementProfile: z.string().optional().describe('The element profile of the material being analyzed.'),
});
export type SuggestStructuresInput = z.infer<typeof SuggestStructuresInputSchema>;

const CrystalStructureMatchSchema = z.object({
  structureId: z.string().describe('A unique identifier for the crystal structure.'),
  commonName: z.string().describe('The common name of the crystal structure.'),
  formula: z.string().describe('The chemical formula of the crystal structure.'),
  confidenceScore: z.number().describe('A score indicating the confidence level of the match (0-1).'),
  crystallographicInformation: z.string().describe('Relevant crystallographic information about the structure.'),
});

const SuggestStructuresOutputSchema = z.object({
  matches: z.array(CrystalStructureMatchSchema).describe('A ranked list of potential crystal structure matches.'),
});
export type SuggestStructuresOutput = z.infer<typeof SuggestStructuresOutputSchema>;

export async function suggestStructures(input: SuggestStructuresInput): Promise<SuggestStructuresOutput> {
  return suggestStructuresFlow(input);
}

const suggestStructuresPrompt = ai.definePrompt({
  name: 'suggestStructuresPrompt',
  input: {
    schema: z.object({
      filename: z.string().describe('The name of the XRD data file.'),
      data: z.string().describe('The content of the XRD data file.'),
      elementProfile: z.string().optional().describe('The element profile of the material being analyzed.'),
    }),
  },
  output: {
    schema: z.object({
      matches: z.array(
        z.object({
          structureId: z.string().describe('A unique identifier for the crystal structure.'),
          commonName: z.string().describe('The common name of the crystal structure.'),
          formula: z.string().describe('The chemical formula of the crystal structure.'),
          confidenceScore: z.number().describe('A score indicating the confidence level of the match (0-1).'),
          crystallographicInformation: z.string().describe('Relevant crystallographic information about the structure.'),
        })
      ).describe('A ranked list of potential crystal structure matches.'),
    }),
  },
  prompt: `You are an expert material scientist specializing in X-ray diffraction (XRD) analysis. You will analyze the provided XRD data and suggest potential matching crystal structures.

Analyze the following XRD data to identify potential crystal structure matches. Provide a ranked list of potential matches, along with a confidence score (0-1) for each match. Include relevant crystallographic information for each structure.

Filename: {{{filename}}}
XRD Data: {{{data}}}
Element Profile: {{{elementProfile}}}

Consider different crystal structures to incorporate in the output. Rank the crystal structures by confidence score.

Output the matches in JSON format.
`,
});

const suggestStructuresFlow = ai.defineFlow<
  typeof SuggestStructuresInputSchema,
  typeof SuggestStructuresOutputSchema
>({
  name: 'suggestStructuresFlow',
  inputSchema: SuggestStructuresInputSchema,
  outputSchema: SuggestStructuresOutputSchema,
}, async (input) => {
  const {output} = await suggestStructuresPrompt({
    filename: input.file.filename,
    data: input.file.data,
    elementProfile: input.elementProfile || '',
  });
  return output!;
});
