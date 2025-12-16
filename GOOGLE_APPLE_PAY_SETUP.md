# Google Pay & Apple Pay Integration

## Overview

We've added Google Pay and Apple Pay support to the checkout page using the Payment Request API. This provides a better user experience with faster checkout.

## How It Works

**Important:** Google Pay and Apple Pay still require a payment processor (Telr) to actually process the payment. The Payment Request API provides:
- Faster checkout experience
- Pre-filled shipping/billing information
- Native payment method selection
- Better mobile experience

## Current Implementation

1. **Payment Request API**: Uses browser's native Payment Request API
2. **Payment Processing**: Still processes through Telr payment gateway
3. **User Experience**: Users can pay with Google Pay/Apple Pay, but the payment is processed via Telr

## Browser Support

- **Google Pay**: Works on Chrome, Edge, and other Chromium-based browsers
- **Apple Pay**: Works on Safari (iOS and macOS)
- **Fallback**: If not available, users can use the regular "Proceed to Payment" button

## Setup Requirements

### For Full Google Pay Integration (Optional)

To enable full Google Pay tokenization (if Telr supports it):

1. Get Google Pay Merchant ID from Google Pay Console
2. Add to `.env`:
   ```env
   NEXT_PUBLIC_GOOGLE_MERCHANT_ID="your-google-merchant-id"
   ```

### For Full Apple Pay Integration (Optional)

To enable full Apple Pay:

1. Register with Apple Pay
2. Get Merchant Identifier
3. Add to `.env`:
   ```env
   NEXT_PUBLIC_APPLE_MERCHANT_ID="merchant.com.amertrading.shop"
   ```

## Current Status

✅ **Implemented:**
- Payment Request API integration
- Google Pay / Apple Pay button on checkout
- Automatic shipping info extraction
- Better mobile checkout experience

⚠️ **Note:**
- Currently processes through Telr (standard payment flow)
- For direct Google Pay/Apple Pay processing, Telr needs to support tokenized payments
- The Payment Request API provides UX benefits even without full tokenization

## How Users See It

1. User clicks "Pay with Google Pay / Apple Pay" button
2. Browser shows native payment sheet (Google Pay or Apple Pay)
3. User selects payment method and confirms
4. Payment details are extracted and order is created
5. User is redirected to Telr for final payment processing
6. Payment completes through Telr

## Future Enhancement

If Telr supports tokenized payments from Google Pay/Apple Pay:
- We can process payments directly without redirecting to Telr
- Faster checkout experience
- Better conversion rates

## Testing

- **Desktop**: Test in Chrome for Google Pay
- **Mobile**: Test on iOS Safari for Apple Pay, Android Chrome for Google Pay
- **Fallback**: If Payment Request API is not available, regular checkout button is shown

## Files Modified

- `app/checkout/page.tsx` - Added Google Pay/Apple Pay button and handler
- `lib/payment-request.ts` - Payment Request API utilities
- `app/api/checkout/create-payment/route.ts` - Updated to handle payment method

