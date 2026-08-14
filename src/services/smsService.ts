/**
 * Kizimba Digital Learning Hub (KDLH) - Real Welcome SMS Service
 */
export interface SendSmsResult {
  success: boolean;
  status: string;
  provider?: string;
  preview?: string;
  missingSecrets?: string[];
  error?: string;
}

export class KdlhSmsService {
  /**
   * Dispatches Welcome SMS to Tanzanian mobile phone via backend SMS integration
   */
  static async sendWelcomeSms(params: {
    phoneNumber: string;
    name: string;
    role: string;
    school?: string;
  }): Promise<SendSmsResult> {
    try {
      const response = await fetch('/api/sms/send-welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        console.warn('[KDLH SMS SERVICE] SMS dispatch warning:', data);
        return { 
          success: false, 
          status: data.status || 'SMS_API_ERROR',
          error: data.error || 'Server error during SMS delivery'
        };
      }

      if (data.status === 'SMS_NOT_CONFIGURED') {
        console.info('[KDLH SMS SERVICE] SMS secrets not yet configured:', data.missingSecrets);
      } else {
        console.log(`[KDLH SMS SERVICE] SMS result: ${data.status} via ${data.provider || 'configured gateway'}`);
      }

      return {
        success: Boolean(data.success),
        status: data.status || 'UNKNOWN',
        provider: data.provider,
        preview: data.messagePreview,
        missingSecrets: data.missingSecrets,
        error: data.error
      };
    } catch (e: any) {
      console.warn('[KDLH SMS SERVICE] SMS network exception:', e);
      return { success: false, status: 'NETWORK_ERROR', error: e?.message };
    }
  }
}

