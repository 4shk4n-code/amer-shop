import type { Metadata } from "next";
import Header from "@/components/Header";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://amertrading.shop';

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read AMERSHOP!'s Privacy Policy to understand how we collect, use, and protect your personal information. Your privacy is important to us.",
  keywords: ["privacy policy", "data protection", "AMERSHOP!", "online privacy"],
  openGraph: {
    title: "Privacy Policy | AMERSHOP!",
    description: "Read AMERSHOP!'s Privacy Policy to understand how we collect, use, and protect your personal information.",
    url: `${baseUrl}/privacy`,
    type: "website",
  },
  alternates: {
    canonical: `${baseUrl}/privacy`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-4">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
            <p className="text-gray-700 mb-4">
              We collect information that you provide directly to us, including when you create
              an account, make a purchase, or contact us for support.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">
              We use the information we collect to process transactions, send you related information,
              respond to your requests, and improve our services.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
            <p className="text-gray-700 mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share
              your information only as necessary to provide our services or as required by law.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
            <p className="text-gray-700 mb-4">
              We implement appropriate security measures to protect your personal information against
              unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

