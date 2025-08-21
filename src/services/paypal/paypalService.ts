
// PayPal SDK integration for business advertisements
export interface PayPalOrderData {
  id: string;
  status: string;
  purchase_units: Array<{
    amount: {
      currency_code: string;
      value: string;
    };
  }>;
}

export interface PaymentData {
  amount: number;
  currency: string;
  description: string;
  advertisementId?: string;
}

export class PayPalService {
  private static CLIENT_ID = 'YOUR_PAYPAL_CLIENT_ID'; // Will be set via environment

  static async createOrder(paymentData: PaymentData): Promise<string> {
    try {
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: paymentData.amount,
          currency: paymentData.currency,
          description: paymentData.description,
          advertisementId: paymentData.advertisementId,
        }),
      });

      const data = await response.json();
      return data.orderId;
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      throw new Error('Failed to create payment order');
    }
  }

  static async captureOrder(orderId: string): Promise<PayPalOrderData> {
    try {
      const response = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error capturing PayPal order:', error);
      throw new Error('Failed to capture payment');
    }
  }

  static getPayPalScript(): Promise<any> {
    return new Promise((resolve, reject) => {
      if ((window as any).paypal) {
        resolve((window as any).paypal);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${this.CLIENT_ID}&currency=USD`;
      script.onload = () => resolve((window as any).paypal);
      script.onerror = () => reject(new Error('PayPal SDK failed to load'));
      document.head.appendChild(script);
    });
  }
}
