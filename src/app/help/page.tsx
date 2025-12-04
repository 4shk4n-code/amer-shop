'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, ChevronDown, ChevronRight, MessageCircle, Phone, Mail, HelpCircle, Package, CreditCard, Truck, Shield, RotateCcw } from 'lucide-react'

const faqCategories = [
  {
    id: 'orders',
    title: 'Orders & Delivery',
    icon: Package,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    id: 'payments',
    title: 'Payments & Refunds',
    icon: CreditCard,
    color: 'bg-green-100 text-green-600',
  },
  {
    id: 'shipping',
    title: 'Shipping & Returns',
    icon: Truck,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    id: 'account',
    title: 'Account & Security',
    icon: Shield,
    color: 'bg-red-100 text-red-600',
  },
  {
    id: 'returns',
    title: 'Returns & Exchanges',
    icon: RotateCcw,
    color: 'bg-orange-100 text-orange-600',
  },
]

const faqs = {
  orders: [
    {
      question: 'How can I track my order?',
      answer: 'You can track your order by logging into your account and going to "My Orders". You will receive tracking updates via email and SMS once your order ships. You can also use the tracking number provided in your order confirmation email.',
    },
    {
      question: 'How long does delivery take?',
      answer: 'Standard delivery takes 2-5 business days within UAE. Express delivery is available for 1-2 business days. International shipping times vary by destination. You can check estimated delivery times during checkout.',
    },
    {
      question: 'Can I cancel my order?',
      answer: 'Yes, you can cancel your order within 1 hour of placing it. After that, you can request cancellation by contacting our customer service team. If your order has already shipped, you can return it using our easy return process.',
    },
    {
      question: 'What if I receive a damaged or wrong item?',
      answer: 'If you receive a damaged or incorrect item, please contact us within 48 hours of delivery. We will arrange for a replacement or full refund, including return shipping costs. Simply reach out via our contact form or call our support line.',
    },
  ],
  payments: [
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit and debit cards (Visa, Mastercard, American Express), cash on delivery, bank transfers, and digital wallets including Apple Pay and Google Pay. All transactions are secure and encrypted.',
    },
    {
      question: 'When will I be charged?',
      answer: 'For card payments, you will be charged immediately when you place your order. For cash on delivery, you pay when you receive your order. Bank transfers may take 1-2 business days to process.',
    },
    {
      question: 'How do I get a refund?',
      answer: 'Refunds are processed automatically once we receive and inspect your returned item. Refunds are issued to your original payment method within 5-10 business days. You will receive an email confirmation when your refund is processed.',
    },
    {
      question: 'Is my payment information secure?',
      answer: 'Yes, we use industry-standard SSL encryption to protect your payment information. We never store your full card details. All transactions are processed through secure payment gateways that comply with PCI DSS standards.',
    },
  ],
  shipping: [
    {
      question: 'What are your shipping charges?',
      answer: 'We offer free shipping on orders over AED 100. For orders below AED 100, standard shipping is AED 15. Express shipping is available for AED 25. International shipping rates vary by destination and are calculated at checkout.',
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by destination. You can check shipping options and costs during checkout by entering your delivery address.',
    },
    {
      question: 'Can I change my delivery address?',
      answer: 'You can change your delivery address within 1 hour of placing your order by contacting customer service. After that, changes may not be possible if your order has already been processed. Contact us immediately if you need to update your address.',
    },
  ],
  account: [
    {
      question: 'How do I create an account?',
      answer: 'Click on "Account" in the top navigation and select "Sign Up". You can create an account using your email address or phone number. You will receive a verification code to complete registration.',
    },
    {
      question: 'I forgot my password. How do I reset it?',
      answer: 'Click "Forgot Password" on the login page and enter your email address. You will receive a password reset link via email. Click the link and follow the instructions to create a new password.',
    },
    {
      question: 'How do I update my account information?',
      answer: 'Log into your account and go to "Settings". You can update your personal information, delivery addresses, payment methods, and notification preferences from there.',
    },
  ],
  returns: [
    {
      question: 'What is your return policy?',
      answer: 'We offer a 7-day return policy for most items. Items must be unused, in original packaging, and with all tags attached. Some items like food, personalized products, and digital services are non-returnable. Check product pages for specific return policies.',
    },
    {
      question: 'How do I return an item?',
      answer: 'Log into your account, go to "My Orders", select the order you want to return, and click "Return Item". Fill out the return form and we will arrange for pickup or provide you with a return shipping label. Returns are free for eligible items.',
    },
    {
      question: 'How long do refunds take?',
      answer: 'Once we receive your returned item and verify it meets our return policy, we process refunds within 5-10 business days. You will receive your refund via the original payment method. You will get an email confirmation when the refund is processed.',
    },
  ],
}

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [openFaqs, setOpenFaqs] = useState<Record<string, boolean>>({})

  const toggleFaq = (category: string, index: number) => {
    const key = `${category}-${index}`
    setOpenFaqs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">How can we help you?</h1>
          <p className="text-xl mb-6">Find answers to common questions or contact our support team</p>
          
          {/* Search Bar */}
          <div className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help articles, FAQs, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Contact Options */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <Link
            href="/contact"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary-500"
          >
            <MessageCircle className="w-8 h-8 text-primary-600 mb-3" />
            <h3 className="font-semibold text-lg mb-2">Chat with Us</h3>
            <p className="text-gray-600 text-sm">Get instant help from our support team</p>
            <p className="text-primary-600 font-medium mt-2">Available 24/7 →</p>
          </Link>
          
          <Link
            href="/contact"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary-500"
          >
            <Phone className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="font-semibold text-lg mb-2">Call Us</h3>
            <p className="text-gray-600 text-sm">Speak directly with our team</p>
            <p className="text-green-600 font-medium mt-2">+971 4 XXX XXXX →</p>
          </Link>
          
          <Link
            href="/contact"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary-500"
          >
            <Mail className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-semibold text-lg mb-2">Email Us</h3>
            <p className="text-gray-600 text-sm">Send us a message anytime</p>
            <p className="text-blue-600 font-medium mt-2">support@amershop.com →</p>
          </Link>
        </div>

        {/* FAQ Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Browse by Topic</h2>
          <div className="grid md:grid-cols-5 gap-4">
            {faqCategories.map((category) => {
              const Icon = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
                  className={`bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-all border-2 ${
                    activeCategory === category.id
                      ? 'border-primary-500'
                      : 'border-transparent hover:border-gray-200'
                  }`}
                >
                  <div className={`${category.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold">{category.title}</h3>
                </button>
              )
            })}
          </div>
        </div>

        {/* FAQs */}
        {activeCategory && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {faqCategories.find((c) => c.id === activeCategory)?.title}
              </h2>
              <button
                onClick={() => setActiveCategory(null)}
                className="text-gray-600 hover:text-gray-900"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              {faqs[activeCategory as keyof typeof faqs]?.map((faq, index) => {
                const key = `${activeCategory}-${index}`
                const isOpen = openFaqs[key]
                return (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFaq(activeCategory, index)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-semibold pr-4">{faq.question}</span>
                      {isOpen ? (
                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-gray-700 border-t border-gray-200">
                        <p className="pt-4">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Popular Articles */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Popular Help Articles</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'How to place an order',
              'Track your order status',
              'Return or exchange items',
              'Payment methods accepted',
              'Shipping and delivery options',
              'Create and manage your account',
              'Product warranty information',
              'Contact customer service',
            ].map((article, index) => (
              <Link
                key={index}
                href="#"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <HelpCircle className="w-5 h-5 text-gray-400 group-hover:text-primary-600" />
                <span className="text-gray-700 group-hover:text-primary-600">{article}</span>
                <ChevronRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-primary-600" />
              </Link>
            ))}
          </div>
        </div>

        {/* Still Need Help */}
        <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg p-8 mt-8 text-center">
          <HelpCircle className="w-12 h-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Still need help?</h3>
          <p className="text-gray-600 mb-6">
            Our customer service team is here to assist you with any questions or concerns.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}

