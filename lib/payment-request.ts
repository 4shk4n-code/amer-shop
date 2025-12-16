/**
 * Payment Request API utilities for Google Pay and Apple Pay
 */

export interface PaymentRequestOptions {
  total: number;
  currency: string;
  items: Array<{
    label: string;
    amount: number;
  }>;
  shippingInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

// Payment Method Data for Payment Request API
// The PaymentRequest API accepts PaymentMethodData which has supportedMethods as string
// We'll use 'any' type to match the browser's Payment Request API types
export type PaymentMethodData = any;

/**
 * Check if Payment Request API is available
 */
export function isPaymentRequestSupported(): boolean {
  return typeof window !== 'undefined' && 'PaymentRequest' in window;
}

/**
 * Check if Google Pay is available
 */
export function isGooglePayAvailable(): boolean {
  if (!isPaymentRequestSupported()) return false;
  
  try {
    const paymentMethods: PaymentMethodData[] = [
      {
        supportedMethods: 'https://google.com/pay',
        data: {
          environment: 'PRODUCTION',
          apiVersion: 2,
          apiVersionMinor: 0,
        },
      },
    ];

    const details: PaymentDetailsInit = {
      total: {
        label: 'Total',
        amount: { currency: 'AED', value: '0.01' },
      },
    };

    const request = new PaymentRequest(paymentMethods, details);
    return request.canMakePayment !== undefined;
  } catch {
    return false;
  }
}

/**
 * Check if Apple Pay is available
 */
export function isApplePayAvailable(): boolean {
  if (!isPaymentRequestSupported()) return false;
  
  try {
    const paymentMethods: PaymentMethodData[] = [
      {
        supportedMethods: 'https://apple.com/apple-pay',
        data: {
          version: 3,
          merchantIdentifier: 'merchant.com.amertrading.shop',
        },
      },
    ];

    const details: PaymentDetailsInit = {
      total: {
        label: 'Total',
        amount: { currency: 'AED', value: '0.01' },
      },
    };

    const request = new PaymentRequest(paymentMethods, details);
    return request.canMakePayment !== undefined;
  } catch {
    return false;
  }
}

/**
 * Create Payment Request for Google Pay / Apple Pay
 */
export async function createPaymentRequest(
  options: PaymentRequestOptions
): Promise<PaymentRequest> {
  if (!isPaymentRequestSupported()) {
    throw new Error('Payment Request API is not supported in this browser');
  }

  // Payment methods - Google Pay and Apple Pay
  // Note: These still process through Telr payment gateway
  const paymentMethods: PaymentMethodData[] = [
    {
      supportedMethods: 'https://google.com/pay',
      data: {
        environment: process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'TEST',
        apiVersion: 2,
        apiVersionMinor: 0,
        merchantName: 'AMERSHOP!',
        merchantId: process.env.NEXT_PUBLIC_GOOGLE_MERCHANT_ID || '',
        allowedPaymentMethods: [
          {
            type: 'CARD',
            parameters: {
              allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
              allowedCardNetworks: ['AMEX', 'DISCOVER', 'JCB', 'MASTERCARD', 'VISA'],
            },
          },
        ],
      },
    },
    {
      supportedMethods: 'https://apple.com/apple-pay',
      data: {
        version: 3,
        merchantIdentifier: process.env.NEXT_PUBLIC_APPLE_MERCHANT_ID || 'merchant.com.amertrading.shop',
        countryCode: 'AE',
        currencyCode: 'AED',
        supportedNetworks: ['amex', 'discover', 'masterCard', 'visa'],
      },
    },
  ];

  const paymentDetails: PaymentDetailsInit = {
    displayItems: options.items.map((item) => ({
      label: item.label,
      amount: {
        currency: options.currency,
        value: item.amount.toFixed(2),
      },
    })),
    total: {
      label: 'Total',
      amount: {
        currency: options.currency,
        value: options.total.toFixed(2),
      },
    },
  };

  const paymentOptions: PaymentOptions = {
    requestPayerName: true,
    requestPayerEmail: true,
    requestPayerPhone: true,
    requestShipping: !!options.shippingInfo,
    shippingType: 'delivery' as PaymentShippingType,
  };

  return new PaymentRequest(paymentMethods, paymentDetails, paymentOptions);
}

/**
 * Process payment using Payment Request API
 */
export async function processPaymentRequest(
  options: PaymentRequestOptions
): Promise<PaymentResponse> {
  const request = await createPaymentRequest(options);
  
  // Check if payment can be made
  const canMakePayment = await request.canMakePayment();
  if (!canMakePayment) {
    throw new Error('Payment method not available');
  }

  // Show payment sheet
  const response = await request.show();
  
  return response;
}

