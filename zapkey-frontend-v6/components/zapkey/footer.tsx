import Link from "next/link"
import { Facebook, Twitter, Linkedin, Instagram, Youtube } from "lucide-react"
import { PureframeLogo } from "@/components/pureframe-logo"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Logo Section */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center text-orange-500">
                <PureframeLogo className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold">Pureframe Labs</span>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Services
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="#" className="hover:text-white">
                  Sell with Pureframe Labs
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Buy Pureframe Homes
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  For Broker Partners
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="#" className="hover:text-white">
                  Blogs
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Terms of use
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="mb-4 text-sm font-semibold">
              Follow us on social media
            </h4>
            <div className="flex gap-4">
              <Link href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <p className="text-center text-sm text-gray-500">
            © Pureframe Labs 2026
          </p>
        </div>
      </div>
    </footer>
  )
}
