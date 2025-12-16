# Telr Payment Gateway Integration - Information for Telr Support

## Overview
We have completed the integration of Telr payment gateway into our e-commerce platform (AMERSHOP!). The integration is ready and waiting for merchant credentials.

## Integration Method
**Hosted Payment Page (Redirect Method)**
- Customers are redirected to Telr's secure payment page
- All sensitive payment data is handled by Telr (PCI DSS compliant)
- Customers return to our site after payment completion

## Technical Details

### Base URL
```
Production: https://amertrading.shop
Development: http://localhost:3000
```

### Webhook Configuration
**Webhook URL:**
```
https://amertrading.shop/api/checkout/webhook
```

**Webhook Method:** POST (also supports GET)

**Webhook Security:** SHA-256 signature verification implemented

### Return URLs

**Success URL:**
```
https://amertrading.shop/checkout/success?order_id={order_id}
```

**Cancel URL:**
```
https://amertrading.shop/checkout/cancel?order_id={order_id}
```

**Declined URL:**
```
https://amertrading.shop/checkout/declined?order_id={order_id}
```

### Payment Parameters

We send the following parameters to Telr:

- `ivp_method`: "create"
- `ivp_store`: [Merchant ID]
- `ivp_authkey`: [API Key]
- `ivp_cart`: Order ID (format: ORD-{orderId}-{timestamp})
- `ivp_test`: "0" (production) or "1" (test mode)
- `ivp_amount`: Payment amount (AED)
- `ivp_currency`: "AED"
- `ivp_desc`: Product description
- `return_auth`: Success URL
- `return_can`: Cancel URL
- `return_decl`: Declined URL
- `bill_fname`: Customer first name
- `bill_lname`: Customer last name
- `bill_email`: Customer email
- `bill_addr1`: Customer address
- `bill_city`: Customer city
- `bill_country`: "AE" (UAE)
- `bill_phone`: Customer phone
- `ivp_signature`: SHA-256 signature

### Signature Generation

We generate signatures using SHA-256:
```
signature = SHA256(API_KEY + sorted_params + API_PASSWORD)
```

### Currency
**AED (UAE Dirham)**

### Test Mode
- Automatically enabled in development environment
- Can be toggled via `ivp_test` parameter

## Required Credentials

We need the following from Telr:

1. **Merchant ID (Store ID)**
   - Used in `ivp_store` parameter

2. **API Key (Authentication Key)**
   - Used in `ivp_authkey` parameter
   - Used for signature generation

3. **API Password**
   - Used for signature generation

## Integration Status

✅ **Completed:**
- Checkout page with form validation
- Payment API endpoint
- Webhook handler with signature verification
- Success/Cancel/Declined pages
- Order tracking in database
- Secure payment flow
- Error handling

⏳ **Pending:**
- Telr merchant credentials
- Webhook URL configuration in Telr dashboard
- Test transaction verification

## Database Integration

Orders are stored in our database with the following statuses:

**Payment Status:**
- `pending` - Awaiting payment
- `paid` - Payment successful
- `failed` - Payment failed/declined
- `refunded` - Payment refunded

**Order Status:**
- `pending` - Initial order creation
- `processing` - Payment successful, order being prepared
- `shipped` - Order shipped
- `delivered` - Order delivered
- `cancelled` - Order cancelled

## Security Features

1. **Signature Verification**: All webhook requests are verified using SHA-256
2. **Order Validation**: Orders are validated before payment processing
3. **Secure Redirects**: Payment URLs are generated server-side
4. **Status Tracking**: Payment status is tracked in database
5. **PCI Compliance**: Using hosted payment page (no card data on our servers)

## Testing Requirements

We would like to receive:
- Test merchant credentials (if available)
- Test card numbers for testing
- Test webhook endpoint access
- Documentation for webhook parameters

## Support Contact

For any questions or clarifications about our integration, please contact:
- Email: info@amertrading.ae
- Website: https://amertrading.shop

## Files Reference

- Checkout Page: `/checkout`
- Payment API: `/api/checkout/create-payment`
- Webhook Handler: `/api/checkout/webhook`
- Success Page: `/checkout/success`
- Cancel Page: `/checkout/cancel`
- Declined Page: `/checkout/declined`

## Next Steps

1. Receive merchant credentials from Telr
2. Configure webhook URL in Telr dashboard
3. Test payment flow with test credentials
4. Verify webhook callbacks
5. Go live with production credentials

---

**Integration Date:** December 2024
**Platform:** Next.js 14 (App Router)
**Database:** Prisma with SQLite/PostgreSQL

