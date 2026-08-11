export interface AiRequestOptions {
  prompt: string;
  userRole?: string;
  form?: string;
  subject?: string;
}

export interface AiResponseData {
  response: string;
  citations?: {
    title: string;
    type: string;
    id: string;
  }[];
  isDemoMode?: boolean;
  error?: string;
}

export async function sendAiQuery(options: AiRequestOptions): Promise<AiResponseData> {
  try {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(options)
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP error! status: ${res.status}`);
    }

    const data: AiResponseData = await res.json();
    return data;
  } catch (err: any) {
    console.error('AI Service Error:', err);
    return {
      response: `An error occurred while connecting to KDLH AI. (${err.message || 'Network error'}). You can still use offline academic study modes.`,
      isDemoMode: true,
      error: err.message
    };
  }
}
