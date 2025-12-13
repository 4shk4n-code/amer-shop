import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Policies */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Policies</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms"
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/refund"
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                >
                  Refund / Return Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                >
                  Shipping / Delivery Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:info@amertrading.ae"
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                >
                  info@amertrading.ae
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <a
                  href="tel:+971525485401"
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                >
                  +971 52 548 5401
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600 text-sm">
                  Sharjah Industrial Area 6, Amer General Trading
                </span>
              </li>
            </ul>
          </div>

          {/* Company Info */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-gray-900 mb-4">AMERSHOP!</h3>
            <p className="text-gray-600 text-sm mb-4">
              Your trusted partner for quality products and exceptional service.
            </p>
            <p className="text-gray-500 text-xs">
              &copy; {new Date().getFullYear()} AMERSHOP!. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

