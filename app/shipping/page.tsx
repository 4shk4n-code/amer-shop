import Header from "@/components/Header";

export default function ShippingPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Shipping / Delivery Policy</h1>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-4">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Shipping Methods</h2>
            <p className="text-gray-700 mb-4">
              We offer various shipping options including standard delivery, express delivery, and
              same-day delivery (where available). Shipping costs and delivery times vary by location.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Delivery Times</h2>
            <p className="text-gray-700 mb-4">
              Standard delivery typically takes 3-5 business days within the UAE. Express delivery
              is available for 1-2 business days. International shipping times vary by destination.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Shipping Costs</h2>
            <p className="text-gray-700 mb-4">
              Shipping costs are calculated at checkout based on your location and selected shipping
              method. Free shipping may be available for orders above a certain amount.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Order Tracking</h2>
            <p className="text-gray-700 mb-4">
              Once your order ships, you will receive a tracking number via email. You can use this
              to track your package's progress.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

