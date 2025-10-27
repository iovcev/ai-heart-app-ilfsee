
import { useState } from 'react';

export type OpenAIMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export function useOpenAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateResponse = async (
    messages: OpenAIMessage[],
    apiKey: string
  ): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: messages,
          temperature: 0.8,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to generate response');
      }

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content;

      if (!aiResponse) {
        throw new Error('No response from AI');
      }

      return aiResponse;
    } catch (err: any) {
      console.log('OpenAI error:', err);
      setError(err.message || 'Failed to generate response');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { generateResponse, loading, error };
}
