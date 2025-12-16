# Telr Payment Gateway Setup Guide

This guide will help you set up Telr payment gateway for AMERSHOP!

## Prerequisites

1. **Telr Merchant Account**: You need to have an active Telr merchant account
   - Sign up at: https://telr.com/contact-us
   - Complete the merchant application process
   - Get approved by Telr

2. **Telr Credentials**: Once approved, you'll receive:
   - Merchant ID (Store ID)
   - API Key (Authentication Key)
   - API Password

## Environment Variables

Add these to your `.env` file:

```env
# Telr Payment Gateway Configuration
TELR_MERCHANT_ID="your-merchant-id-here"
TELR_API_KEY="your-api-key-here"
TELR_API_PASSWORD="your-api-password-here"
TELR_BASE_URL="https://secure.telr.com/gateway/remote.html"
```

## Integration Details

### Payment Flow

1. **Customer adds items to cart** → `/cart`
2. **Customer clicks "Proceed to Checkout"** → `/checkout`
3. **Customer fills shipping/billing information**
4. **Customer clicks "Proceed to Payment"**
5. **System creates order** → Saves to database with `pending` status
6. **System generates Telr payment URL** → Redirects customer to Telr's secure payment page
7. **Customer completes payment on Telr**
8. **Telr redirects back** → Success/Cancel/Declined pages
9. **Telr sends webhook** → Updates order status in database

### Webhook Configuration

Configure your Telr webhook URL in the Telr Merchant Dashboard:

```
https://yourdomain.com/api/checkout/webhook
```

The webhook will:
- Verify the payment signature
- Update order status (`paid`, `failed`, `pending`)
- Store transaction reference and auth code

### Test Mode

The integration automatically uses test mode in development:

```env
NODE_ENV=development  # Uses test mode
NODE_ENV=production   # Uses live mode
```

### Test Cards (Development)

Telr provides test card numbers for testing. Check Telr's documentation for current test cards.

## Files Created

- `app/checkout/page.tsx` - Checkout page with form
- `app/checkout/success/page.tsx` - Payment success page
- `app/checkout/cancel/page.tsx` - Payment cancelled page
- `app/checkout/declined/page.tsx` - Payment declined page
- `app/api/checkout/create-payment/route.ts` - Creates payment and redirects to Telr
- `app/api/checkout/webhook/route.ts` - Handles Telr webhook callbacks

## Security Features

1. **Signature Verification**: All webhook requests are verified using SHA-256 signature
2. **Order Validation**: Orders are validated before payment processing
3. **Secure Redirects**: Payment URLs are generated server-side
4. **Status Tracking**: Payment status is tracked in database

## Order Status Flow

- `pending` → Initial order creation
- `processing` → Payment successful, order being prepared
- `shipped` → Order shipped
- `delivered` → Order delivered
- `cancelled` → Payment failed or order cancelled

## Payment Status Flow

- `pending` → Awaiting payment
- `paid` → Payment successful
- `failed` → Payment failed/declined
- `refunded` → Payment refunded

## Support

For Telr integration support:
- Telr Documentation: https://docs.telr.com/
- Telr Support: https://telr.com/contact-us

## Notes

- The integration uses Telr's Hosted Payment Page method (redirect)
- All sensitive payment data is handled by Telr (PCI DSS compliant)
- Orders are created before payment to track the transaction
- Cart is cleared only after successful payment confirmation

