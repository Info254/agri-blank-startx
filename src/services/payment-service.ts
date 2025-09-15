// @ts-nocheck
interface PaymentRequest {
  amount: number;
  phoneNumber: string;
  accountReference: string;
  transactionDesc: string;
  callbackUrl?: string;
}

interface PaymentResponse {
  merchantRequestID: string;
  checkoutRequestID: string;
  responseCode: string;
  responseDescription: string;
  customerMessage: string;
}

interface PaymentStatus {
  merchantRequestID: string;
  checkoutRequestID: string;
  resultCode: string;
  resultDesc: string;
  amount?: number;
  mpesaReceiptNumber?: string;
  transactionDate?: string;
  phoneNumber?: string;
}

export class PaymentService {
  private static instance: PaymentService;
  private consumerKey: string = process.env.VITE_MPESA_CONSUMER_KEY || '';
  private consumerSecret: string = process.env.VITE_MPESA_CONSUMER_SECRET || '';
  private businessShortCode: string = process.env.VITE_MPESA_SHORTCODE || '174379';
  private passkey: string = process.env.VITE_MPESA_PASSKEY || '';
  private baseUrl: string = process.env.VITE_MPESA_ENVIRONMENT === 'production' 
    ? 'https://api.safaricom.co.ke' 
    : 'https://sandbox.safaricom.co.ke';

  private constructor() {}

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  async initiateSTKPush(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    try {
      const accessToken = await this.getAccessToken();
      const timestamp = this.generateTimestamp();
      const password = this.generatePassword(timestamp);

      const stkPushData = {
        BusinessShortCode: this.businessShortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: paymentRequest.amount,
        PartyA: paymentRequest.phoneNumber,
        PartyB: this.businessShortCode,
        PhoneNumber: paymentRequest.phoneNumber,
        CallBackURL: paymentRequest.callbackUrl || `${window.location.origin}/api/mpesa/callback`,
        AccountReference: paymentRequest.accountReference,
        TransactionDesc: paymentRequest.transactionDesc
      };

      const response = await fetch(`${this.baseUrl}/mpesa/stkpush/v1/processrequest`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(stkPushData)
      });

      if (!response.ok) {
        throw new Error(`M-Pesa API error: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Store transaction for tracking
      await this.storeTransaction({
        merchantRequestID: result.MerchantRequestID,
        checkoutRequestID: result.CheckoutRequestID,
        amount: paymentRequest.amount,
        phoneNumber: paymentRequest.phoneNumber,
        accountReference: paymentRequest.accountReference,
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      return {
        merchantRequestID: result.MerchantRequestID,
        checkoutRequestID: result.CheckoutRequestID,
        responseCode: result.ResponseCode,
        responseDescription: result.ResponseDescription,
        customerMessage: result.CustomerMessage
      };
    } catch (error) {
      console.error('STK Push failed:', error);
      throw error;
    }
  }

  async checkTransactionStatus(checkoutRequestID: string): Promise<PaymentStatus> {
    try {
      const accessToken = await this.getAccessToken();
      const timestamp = this.generateTimestamp();
      const password = this.generatePassword(timestamp);

      const queryData = {
        BusinessShortCode: this.businessShortCode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestID
      };

      const response = await fetch(`${this.baseUrl}/mpesa/stkpushquery/v1/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(queryData)
      });

      if (!response.ok) {
        throw new Error(`M-Pesa query error: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Update transaction status
      await this.updateTransactionStatus(checkoutRequestID, {
        resultCode: result.ResultCode,
        resultDesc: result.ResultDesc,
        status: result.ResultCode === '0' ? 'completed' : 'failed'
      });

      return {
        merchantRequestID: result.MerchantRequestID,
        checkoutRequestID: result.CheckoutRequestID,
        resultCode: result.ResultCode,
        resultDesc: result.ResultDesc
      };
    } catch (error) {
      console.error('Transaction status check failed:', error);
      throw error;
    }
  }

  private async getAccessToken(): Promise<string> {
    try {
      const auth = btoa(`${this.consumerKey}:${this.consumerSecret}`);
      
      const response = await fetch(`${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get access token: ${response.statusText}`);
      }

      const result = await response.json();
      return result.access_token;
    } catch (error) {
      console.error('Failed to get M-Pesa access token:', error);
      throw error;
    }
  }

  private generateTimestamp(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }

  private generatePassword(timestamp: string): string {
    const data = `${this.businessShortCode}${this.passkey}${timestamp}`;
    return btoa(data);
  }

  private async storeTransaction(transaction: any): Promise<void> {
    try {
      // Store in Supabase
      const { error } = await (await import('@/lib/supabaseClient')).supabase
        .from('mpesa_transactions')
        .insert([transaction]);
      
      if (error) {
        console.error('Failed to store transaction:', error);
      }
    } catch (error) {
      console.error('Transaction storage error:', error);
    }
  }

  private async updateTransactionStatus(checkoutRequestID: string, updates: any): Promise<void> {
    try {
      const { error } = await (await import('@/lib/supabaseClient')).supabase
        .from('mpesa_transactions')
        .update({
          ...updates,
          updatedAt: new Date().toISOString()
        })
        .eq('checkoutRequestID', checkoutRequestID);
      
      if (error) {
        console.error('Failed to update transaction status:', error);
      }
    } catch (error) {
      console.error('Transaction update error:', error);
    }
  }

  // Escrow functionality for buyer protection
  async createEscrowTransaction(paymentData: {
    buyerId: string;
    sellerId: string;
    amount: number;
    productId: string;
    phoneNumber: string;
  }): Promise<PaymentResponse> {
    try {
      // Create escrow record first
      const escrowId = await this.createEscrowRecord(paymentData);
      
      // Initiate M-Pesa payment
      const paymentRequest: PaymentRequest = {
        amount: paymentData.amount,
        phoneNumber: paymentData.phoneNumber,
        accountReference: `ESCROW-${escrowId}`,
        transactionDesc: `Escrow payment for product ${paymentData.productId}`
      };

      return await this.initiateSTKPush(paymentRequest);
    } catch (error) {
      console.error('Escrow transaction failed:', error);
      throw error;
    }
  }

  private async createEscrowRecord(paymentData: any): Promise<string> {
    const escrowRecord = {
      buyer_id: paymentData.buyerId,
      seller_id: paymentData.sellerId,
      amount: paymentData.amount,
      product_id: paymentData.productId,
      status: 'pending_payment',
      created_at: new Date().toISOString(),
      hold_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days hold
    };

    const { data, error } = await (await import('@/lib/supabaseClient')).supabase
      .from('escrow_transactions')
      .insert([escrowRecord])
      .select('id')
      .single();

    if (error) {
      throw new Error(`Failed to create escrow record: ${error.message}`);
    }

    return data.id;
  }

  async releaseEscrowFunds(escrowId: string, deliveryConfirmed: boolean): Promise<void> {
    try {
      const status = deliveryConfirmed ? 'completed' : 'refunded';
      
      const { error } = await (await import('@/lib/supabaseClient')).supabase
        .from('escrow_transactions')
        .update({
          status,
          released_at: new Date().toISOString()
        })
        .eq('id', escrowId);

      if (error) {
        throw new Error(`Failed to release escrow funds: ${error.message}`);
      }

      // In a real implementation, this would trigger actual fund transfer
      console.log(`Escrow funds ${status} for transaction ${escrowId}`);
    } catch (error) {
      console.error('Escrow release failed:', error);
      throw error;
    }
  }

  // Utility methods for payment validation
  validatePhoneNumber(phoneNumber: string): boolean {
    const kenyanPhoneRegex = /^(?:\+254|254|0)?([17]\d{8})$/;
    return kenyanPhoneRegex.test(phoneNumber);
  }

  formatPhoneNumber(phoneNumber: string): string {
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      return '254' + cleaned.substring(1);
    }
    if (cleaned.startsWith('254')) {
      return cleaned;
    }
    return '254' + cleaned;
  }

  validateAmount(amount: number): boolean {
    return amount >= 1 && amount <= 70000; // M-Pesa limits
  }
}
