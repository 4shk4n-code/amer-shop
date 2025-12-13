import Header from "@/components/Header";

export default function RefundPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Refund / Return Policy</h1>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-4">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Return Eligibility</h2>
            <p className="text-gray-700 mb-4">
              Items must be returned within 14 days of delivery. Products must be unused, in their
              original packaging, and in the same condition as when you received them.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Return Process</h2>
            <p className="text-gray-700 mb-4">
              To initiate a return, please contact us at info@amertrading.ae with your order number.
              We will provide you with return instructions and a return authorization number.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Refund Processing</h2>
            <p className="text-gray-700 mb-4">
              Once we receive and inspect your returned item, we will process your refund to the
              original payment method within 5-10 business days.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Non-Returnable Items</h2>
            <p className="text-gray-700 mb-4">
              Certain items are not eligible for return, including perishable goods, personalized
              items, and items damaged by misuse.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

