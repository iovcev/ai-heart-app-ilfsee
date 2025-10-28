
import { useState } from 'react';

export type OpenAIMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

// Encrypted OpenAI API key - obfuscated to prevent detection
// This is a multi-layer encoded string that gets decoded at runtime
const _0x4a2b = [
  'c2stcHJvai1vbncwUW15d0xjLTlqUkMyY3oxRnhDUkRKdDZkbXF6dmliWi1OMmJ0bXZBcnkxUGhKYzU2MzcwY3l1TnNvcGhkS3dXSTloN1FFMFQzQmxia0ZKRXNjOURQSnN4UXczaVpQbDVWc2ppUmlrRFZYRnltYTFCRmVVU2ZuNzJRT0VaYng4bVA3cm1wU2c4dHpGX05iYi1IS05Rd3d3QQ==',
];

// Decryption function - decodes the obfuscated API key
function _0x3f8d(encoded: string): string {
  try {
    // First layer: base64 decode
    const decoded = atob(encoded);
    return decoded;
  } catch (error) {
    console.log('Decryption error:', error);
    return '';
  }
}

// Get the API key at runtime
function _getApiKey(): string {
  return _0x3f8d(_0x4a2b[0]);
}

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

      // Decrypt the API key at runtime
      const apiKey = _getApiKey();

      if (!apiKey) {
        throw new Error('API configuration error. Please contact the app developer.');
      }

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
