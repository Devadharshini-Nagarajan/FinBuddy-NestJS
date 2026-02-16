import { Injectable } from '@nestjs/common';
import { DEFAULT_MONTH_QUESTIONS } from './ai.constants';
import OpenAI from 'openai';

@Injectable()
export class OpenAIService {
  private client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async generateInsights(prompt, data: any): Promise<any> {
    const schema = {
      type: 'object',
      additionalProperties: false,
      properties: {
        title: { type: 'string' },
        summary: { type: 'string' },
        highlights: {
          type: 'array',
          items: { type: 'string' },
          minItems: 2,
          maxItems: 3,
        },
        warnings: { type: 'array', items: { type: 'string' }, maxItems: 2 },
        nextActions: {
          type: 'array',
          items: { type: 'string' },
          minItems: 1,
          maxItems: 2,
        },
      },
      required: ['title', 'summary', 'highlights', 'warnings', 'nextActions'],
    };

    const res = await this.client.responses.create({
      model: 'gpt-4o-mini',
      temperature: 0.3,
      max_output_tokens: 500,
      input: [
        {
          role: 'system',
          content:
            'You are a helpful financial assistant that provides insights based on user budget data. Use ONLY the provided JSON. Be concise. No extra keys. Do not invent numbers.',
        },
        {
          role: 'user',
          content: `${prompt}\n\nDATA:\n${JSON.stringify(data)}`,
        },
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'month_insight',
          schema,
        },
      },
    });
    console.log('res', res);

    const json = JSON.parse(res.output_text);
    return json;
  }
}
