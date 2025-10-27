
import { useState } from 'react';

export type OpenAIMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

// Preset OpenAI API key - configured by the developer
const OPENAI_API_KEY = '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';

export function useOpenAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateResponse = async (
    messages: OpenAIMessage[]
  ): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      console.log('Sending request to OpenAI...');

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: messages,
          temperature: 0.8,
          max_tokens: 500,
        }),
      });

      console.log('OpenAI response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log('OpenAI error data:', errorData);
        
        if (response.status === 401) {
          throw new Error('API key error. Please contact the app developer.');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again in a moment.');
        } else if (response.status === 500) {
          throw new Error('OpenAI service error. Please try again later.');
        } else {
          throw new Error(errorData.error?.message || `API error: ${response.status}`);
        }
      }

      const data = await response.json();
      console.log('OpenAI response received');
      
      const aiResponse = data.choices?.[0]?.message?.content;

      if (!aiResponse) {
        throw new Error('No response from AI. Please try again.');
      }

      return aiResponse;
    } catch (err: any) {
      console.log('OpenAI error:', err);
      const errorMessage = err.message || 'Failed to generate response. Please check your internet connection.';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { generateResponse, loading, error };
}
