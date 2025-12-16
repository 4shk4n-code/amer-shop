"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, ExternalLink, Copy, Check } from "lucide-react";
import { formatPrice } from "@/lib/currency";

export default function DemoPaymentPage() {
  const [amount, setAmount] = useState("100.00");
  const [orderId, setOrderId] = useState("");
  const [paymentLink, setPaymentLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const generatePaymentLink = async () => {
    setLoading(true);
    setCopied(false);
    
    try {
      // Generate a demo order ID
      const demoOrderId = orderId || `DEMO-${Date.now()}`;
      
      // This is a demo - in production, this would call your API
      const baseUrl = window.location.origin;
      const checkoutUrl = `${baseUrl}/checkout?demo=true&amount=${amount}&order=${demoOrderId}`;
      
      setPaymentLink(checkoutUrl);
    } catch (error) {
      console.error("Error generating link:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (paymentLink) {
      navigator.clipboard.writeText(paymentLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Telr Payment Integration Demo</h1>
            <p className="text-muted-foreground text-lg">
              This page demonstrates our Telr payment gateway integration
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Integration Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Integration Status
                </CardTitle>
                <CardDescription>Current implementation status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Checkout Page</span>
                    <span className="text-green-600 font-semibold">✓ Ready</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Payment API</span>
                    <span className="text-green-600 font-semibold">✓ Ready</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Webhook Handler</span>
                    <span className="text-green-600 font-semibold">✓ Ready</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Success/Cancel Pages</span>
                    <span className="text-green-600 font-semibold">✓ Ready</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database Integration</span>
                    <span className="text-green-600 font-semibold">✓ Ready</span>
                  </div>
                  <div className="flex items-center justify-between border-t pt-3">
                    <span className="text-sm font-semibold">Telr Credentials</span>
                    <span className="text-orange-600 font-semibold">⏳ Pending</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Link Generator */}
            <Card>
              <CardHeader>
                <CardTitle>Generate Demo Payment Link</CardTitle>
                <CardDescription>Create a test payment link</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Amount (AED)
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="100.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Order ID (Optional)
                    </label>
                    <Input
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      placeholder="DEMO-12345"
                    />
                  </div>
                  <Button
                    onClick={generatePaymentLink}
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? "Generating..." : "Generate Payment Link"}
                  </Button>
                  
                  {paymentLink && (
                    <div className="mt-4 p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium">Payment Link:</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={copyToClipboard}
                          className="h-6 px-2"
                        >
                          {copied ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                      <a
                        href={paymentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline break-all flex items-center gap-1"
                      >
                        {paymentLink}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Integration Details */}
          <Card>
            <CardHeader>
              <CardTitle>Integration Details for Telr</CardTitle>
              <CardDescription>Information to share with Telr support</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Integration Method:</h3>
                  <p className="text-sm text-muted-foreground">
                    Hosted Payment Page (Redirect Method)
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Webhook URL:</h3>
                  <code className="block p-2 bg-muted rounded text-sm break-all">
                    {typeof window !== 'undefined' 
                      ? `${window.location.origin}/api/checkout/webhook`
                      : 'https://yourdomain.com/api/checkout/webhook'}
                  </code>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Return URLs:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>
                      <strong>Success:</strong>{" "}
                      <code className="bg-muted px-1 rounded">
                        {typeof window !== 'undefined' 
                          ? `${window.location.origin}/checkout/success`
                          : 'https://yourdomain.com/checkout/success'}
                      </code>
                    </li>
                    <li>
                      <strong>Cancel:</strong>{" "}
                      <code className="bg-muted px-1 rounded">
                        {typeof window !== 'undefined' 
                          ? `${window.location.origin}/checkout/cancel`
                          : 'https://yourdomain.com/checkout/cancel'}
                      </code>
                    </li>
                    <li>
                      <strong>Declined:</strong>{" "}
                      <code className="bg-muted px-1 rounded">
                        {typeof window !== 'undefined' 
                          ? `${window.location.origin}/checkout/declined`
                          : 'https://yourdomain.com/checkout/declined'}
                      </code>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Currency:</h3>
                  <p className="text-sm text-muted-foreground">AED (UAE Dirham)</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Required Credentials:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Merchant ID (Store ID)</li>
                    <li>• API Key (Authentication Key)</li>
                    <li>• API Password</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Security Features:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• SHA-256 signature verification</li>
                    <li>• Webhook signature validation</li>
                    <li>• Secure order tracking</li>
                    <li>• PCI DSS compliant (hosted payment page)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <div className="mt-8 flex gap-4 justify-center">
            <Button asChild variant="outline">
              <a href="/checkout" target="_blank">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Checkout Page
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="/TELR_SETUP.md" target="_blank">
                View Setup Documentation
              </a>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

