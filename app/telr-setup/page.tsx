import type { Metadata } from "next";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Telr Payment Gateway Setup Guide",
  description: "Complete guide for setting up Telr payment gateway integration",
  robots: {
    index: true,
    follow: true,
  },
};

export default function TelrSetupPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <article className="prose prose-lg max-w-none">
            <h1>Telr Payment Gateway Setup Guide</h1>
            
            <p>This guide will help you set up Telr payment gateway for AMERSHOP!</p>

            <h2>Prerequisites</h2>
            <ol>
              <li>
                <strong>Telr Merchant Account</strong>: You need to have an active Telr merchant account
                <ul>
                  <li>Sign up at: <a href="https://telr.com/contact-us" target="_blank" rel="noopener noreferrer">https://telr.com/contact-us</a></li>
                  <li>Complete the merchant application process</li>
                  <li>Get approved by Telr</li>
                </ul>
              </li>
              <li>
                <strong>Telr Credentials</strong>: Once approved, you&apos;ll receive:
                <ul>
                  <li>Merchant ID (Store ID)</li>
                  <li>API Key (Authentication Key)</li>
                  <li>API Password</li>
                </ul>
              </li>
            </ol>

            <h2>Environment Variables</h2>
            <p>Add these to your <code>.env</code> file:</p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
{`TELR_MERCHANT_ID="your-merchant-id-here"
TELR_API_KEY="your-api-key-here"
TELR_API_PASSWORD="your-api-password-here"
TELR_BASE_URL="https://secure.telr.com/gateway/remote.html"`}
            </pre>

            <h2>Integration Details</h2>

            <h3>Payment Flow</h3>
            <ol>
              <li><strong>Customer adds items to cart</strong> → <code>/cart</code></li>
              <li><strong>Customer clicks &quot;Proceed to Checkout&quot;</strong> → <code>/checkout</code></li>
              <li><strong>Customer fills shipping/billing information</strong></li>
              <li><strong>Customer clicks &quot;Proceed to Payment&quot;</strong></li>
              <li><strong>System creates order</strong> → Saves to database with <code>pending</code> status</li>
              <li><strong>System generates Telr payment URL</strong> → Redirects customer to Telr&apos;s secure payment page</li>
              <li><strong>Customer completes payment on Telr</strong></li>
              <li><strong>Telr redirects back</strong> → Success/Cancel/Declined pages</li>
              <li><strong>Telr sends webhook</strong> → Updates order status in database</li>
            </ol>

            <h3>Webhook Configuration</h3>
            <p>Configure your Telr webhook URL in the Telr Merchant Dashboard:</p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
{`https://amertrading.shop/api/checkout/webhook`}
            </pre>
            <p>The webhook will:</p>
            <ul>
              <li>Verify the payment signature</li>
              <li>Update order status (<code>paid</code>, <code>failed</code>, <code>pending</code>)</li>
              <li>Store transaction reference and auth code</li>
            </ul>

            <h3>Test Mode</h3>
            <p>The integration automatically uses test mode in development:</p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
{`NODE_ENV=development  # Uses test mode
NODE_ENV=production   # Uses live mode`}
            </pre>

            <h3>Test Cards (Development)</h3>
            <p>Telr provides test card numbers for testing. Check Telr&apos;s documentation for current test cards.</p>

            <h2>Files Created</h2>
            <ul>
              <li><code>app/checkout/page.tsx</code> - Checkout page with form</li>
              <li><code>app/checkout/success/page.tsx</code> - Payment success page</li>
              <li><code>app/checkout/cancel/page.tsx</code> - Payment cancelled page</li>
              <li><code>app/checkout/declined/page.tsx</code> - Payment declined page</li>
              <li><code>app/api/checkout/create-payment/route.ts</code> - Creates payment and redirects to Telr</li>
              <li><code>app/api/checkout/webhook/route.ts</code> - Handles Telr webhook callbacks</li>
            </ul>

            <h2>Security Features</h2>
            <ol>
              <li><strong>Signature Verification</strong>: All webhook requests are verified using SHA-256 signature</li>
              <li><strong>Order Validation</strong>: Orders are validated before payment processing</li>
              <li><strong>Secure Redirects</strong>: Payment URLs are generated server-side</li>
              <li><strong>Status Tracking</strong>: Payment status is tracked in database</li>
            </ol>

            <h2>Order Status Flow</h2>
            <ul>
              <li><code>pending</code> → Initial order creation</li>
              <li><code>processing</code> → Payment successful, order being prepared</li>
              <li><code>shipped</code> → Order shipped</li>
              <li><code>delivered</code> → Order delivered</li>
              <li><code>cancelled</code> → Payment failed or order cancelled</li>
            </ul>

            <h2>Payment Status Flow</h2>
            <ul>
              <li><code>pending</code> → Awaiting payment</li>
              <li><code>paid</code> → Payment successful</li>
              <li><code>failed</code> → Payment failed/declined</li>
              <li><code>refunded</code> → Payment refunded</li>
            </ul>

            <h2>Support</h2>
            <p>For Telr integration support:</p>
            <ul>
              <li>Telr Documentation: <a href="https://docs.telr.com/" target="_blank" rel="noopener noreferrer">https://docs.telr.com/</a></li>
              <li>Telr Support: <a href="https://telr.com/contact-us" target="_blank" rel="noopener noreferrer">https://telr.com/contact-us</a></li>
            </ul>

            <h2>Notes</h2>
            <ul>
              <li>The integration uses Telr&apos;s Hosted Payment Page method (redirect)</li>
              <li>All sensitive payment data is handled by Telr (PCI DSS compliant)</li>
              <li>Orders are created before payment to track the transaction</li>
              <li>Cart is cleared only after successful payment confirmation</li>
            </ul>
          </article>
        </div>
      </main>
    </div>
  );
}

