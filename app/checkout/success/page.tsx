import Link from 'next/link';

export default function CheckoutSuccessPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                        {/* Success Icon */}
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-3xl text-green-600">✓</span>
                        </div>

                        {/* Success Message */}
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            Order Confirmed!
                        </h1>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            Thank you for your purchase! Your order has been confirmed and will be shipped within 2-3 business days.
                        </p>

                        {/* Order Details */}
                        <div className="bg-gray-50 rounded-lg p-6 mb-6">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="text-left">
                                    <p className="text-gray-500">Order Number</p>
                                    <p className="font-medium text-gray-900">#ORD-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                                </div>
                                <div className="text-left">
                                    <p className="text-gray-500">Estimated Delivery</p>
                                    <p className="font-medium text-gray-900">
                                        {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-left">
                                    <p className="text-gray-500">Shipping Method</p>
                                    <p className="font-medium text-gray-900">Standard Shipping</p>
                                </div>
                                <div className="text-left">
                                    <p className="text-gray-500">Email Confirmation</p>
                                    <p className="font-medium text-gray-900">Sent to your email</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/products"
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Continue Shopping
                            </Link>
                            <Link
                                href="/orders"
                                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                View Order Details
                            </Link>
                        </div>

                        {/* Support Info */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <p className="text-sm text-gray-500">
                                Need help? <Link href="/contact" className="text-blue-600 hover:text-blue-700">Contact our support team</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}