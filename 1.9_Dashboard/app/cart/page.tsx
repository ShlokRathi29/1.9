'use client'

import Link from 'next/link'
import { Trash2, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Navbar } from '@/components/navbar'
import { ProfileSidebar } from '@/components/profile-sidebar'
import { Footer } from '@/components/pureframe/footer'
import { useAppStore } from '@/lib/store'
import { useToast } from '@/hooks/use-toast'

export default function CartPage() {
  const { cart, removeFromCart, addTokens, clearCart } = useAppStore()
  const { toast } = useToast()

  const totalTokens = cart.reduce((sum, item) => sum + item.tokens, 0)
  const totalPrice = totalTokens * 10 // Assuming 1 token = â‚¹10

  const handleCheckout = () => {
    addTokens(totalTokens)
    clearCart()
    toast({
      title: 'Purchase Successful',
      description: `${totalTokens} tokens added to your account!`,
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <ProfileSidebar />

      <div className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              {cart.length === 0 ? (
                <Card className="border border-gray-200">
                  <CardContent className="pt-12 pb-12">
                    <div className="flex flex-col items-center justify-center">
                      <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Your cart is empty
                      </h2>
                      <p className="text-gray-600 mb-6">
                        Add projects to view their transactions
                      </p>
                      <Link href="/">
                        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                          Continue Shopping
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <Card key={item.projectId} className="border border-gray-200">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">
                              {item.projectName}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {item.tokens} tokens
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <p className="text-lg font-semibold text-gray-900">
                              â‚¹{item.tokens * 10}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                removeFromCart(item.projectId)
                                toast({
                                  title: 'Removed',
                                  description: `${item.projectName} removed from cart`,
                                })
                              }}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Summary */}
            {cart.length > 0 && (
              <div>
                <Card className="border border-gray-200 sticky top-24">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal ({totalTokens} tokens)</span>
                        <span>â‚¹{totalPrice}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Tax (18%)</span>
                        <span>â‚¹{Math.round(totalPrice * 0.18)}</span>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span className="text-orange-600">
                          â‚¹{Math.round(totalPrice * 1.18)}
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={handleCheckout}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white h-12 font-semibold"
                    >
                      Proceed to Checkout
                    </Button>
                    <Link href="/">
                      <Button
                        variant="outline"
                        className="w-full"
                      >
                        Continue Shopping
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
