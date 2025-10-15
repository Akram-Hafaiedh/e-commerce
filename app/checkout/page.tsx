'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CartItem } from '@/types/cart';
import { useCart } from '../context/CartContext';

export default function CheckoutPage() {
    const { items, getTotalPrice, clearCart } = useCart();
    const router = useRouter();

    const [currentStep, setCurrentStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        zipCode: '',
        country: '',
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
        saveInfo: false
    });

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                        <div className="text-6xl mb-4">🛒</div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            You need to add some products to your cart before checking out.
                        </p>
                        <Link
                            href="/products"
                            className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const subtotal = getTotalPrice();
    const shipping = subtotal > 50 ? 0 : 9.99;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleNextStep = () => {
        setCurrentStep(prev => prev + 1);
    };

    const handlePreviousStep = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleSubmitOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Clear cart and redirect to success page
        clearCart();
        router.push('/checkout/success');
    };

    // Step 1: Contact & Shipping
    const renderStep1 = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="your@email.com"
                        />
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Shipping Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                            First Name
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            required
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            required
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                            Street Address
                        </label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            required
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                            City
                        </label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            required
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                            ZIP Code
                        </label>
                        <input
                            type="text"
                            id="zipCode"
                            name="zipCode"
                            required
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                            Country
                        </label>
                        <select
                            id="country"
                            name="country"
                            required
                            value={formData.country}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select Country</option>
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="UK">United Kingdom</option>
                            <option value="AU">Australia</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="saveInfo"
                    name="saveInfo"
                    checked={formData.saveInfo}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="saveInfo" className="ml-2 text-sm text-gray-700">
                    Save this information for next time
                </label>
            </div>
        </div>
    );

    // Step 2: Payment
    const renderStep2 = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Payment Information</h3>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                    <span className="text-yellow-600 mr-2">🔒</span>
                    <p className="text-yellow-800 text-sm">
                        This is a demo store. No real payments will be processed.
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number
                    </label>
                    <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        required
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                    />
                </div>

                <div>
                    <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                        Name on Card
                    </label>
                    <input
                        type="text"
                        id="cardName"
                        name="cardName"
                        required
                        value={formData.cardName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="John Doe"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                            Expiry Date
                        </label>
                        <input
                            type="text"
                            id="expiryDate"
                            name="expiryDate"
                            required
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="MM/YY"
                            maxLength={5}
                        />
                    </div>
                    <div>
                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                            CVV
                        </label>
                        <input
                            type="text"
                            id="cvv"
                            name="cvv"
                            required
                            value={formData.cvv}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="123"
                            maxLength={3}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    // Step 3: Review & Confirm
    const renderStep3 = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Review Your Order</h3>

            <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Shipping Address</h4>
                <p className="text-gray-600">
                    {formData.firstName} {formData.lastName}<br />
                    {formData.address}<br />
                    {formData.city}, {formData.zipCode}<br />
                    {formData.country}
                </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Payment Method</h4>
                <p className="text-gray-600">
                    Card ending in {formData.cardNumber.slice(-4)}<br />
                    Expires: {formData.expiryDate}
                </p>
            </div>

            <div className="border-t border-gray-200 pt-4">
                <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                <div className="space-y-3">
                    {items.map((item: CartItem) => (
                        <div key={item.product.id} className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-purple-50 rounded flex items-center justify-center">
                                    <span className="text-sm">📦</span>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{item.product.name}</p>
                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                </div>
                            </div>
                            <p className="font-medium text-gray-900">
                                ${(item.product.price * item.quantity).toFixed(2)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/cart" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Cart
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Checkout Form */}
                    <div className="lg:w-2/3">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            {/* Progress Steps */}
                            <div className="flex items-center justify-between mb-8">
                                {[1, 2, 3].map((step) => (
                                    <div key={step} className="flex items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === currentStep
                                            ? 'bg-blue-600 text-white'
                                            : step < currentStep
                                                ? 'bg-green-500 text-white'
                                                : 'bg-gray-200 text-gray-500'
                                            }`}>
                                            {step < currentStep ? '✓' : step}
                                        </div>
                                        {step < 3 && (
                                            <div className={`w-16 h-1 mx-2 ${step < currentStep ? 'bg-green-500' : 'bg-gray-200'
                                                }`} />
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {currentStep === 1 && 'Shipping Information'}
                                    {currentStep === 2 && 'Payment Details'}
                                    {currentStep === 3 && 'Review Order'}
                                </h2>
                                <span className="text-sm text-gray-500">Step {currentStep} of 3</span>
                            </div>

                            <form onSubmit={handleSubmitOrder}>
                                {/* Step Content */}
                                {currentStep === 1 && renderStep1()}
                                {currentStep === 2 && renderStep2()}
                                {currentStep === 3 && renderStep3()}

                                {/* Navigation Buttons */}
                                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                                    {currentStep > 1 ? (
                                        <button
                                            type="button"
                                            onClick={handlePreviousStep}
                                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                        >
                                            Previous
                                        </button>
                                    ) : (
                                        <div></div>
                                    )}

                                    {currentStep < 3 ? (
                                        <button
                                            type="button"
                                            onClick={handleNextStep}
                                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                        >
                                            Continue
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={isProcessing}
                                            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 transition-colors font-medium flex items-center"
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Processing...
                                                </>
                                            ) : (
                                                'Place Order'
                                            )}
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="text-gray-900">
                                        {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="text-gray-900">${tax.toFixed(2)}</span>
                                </div>
                                <div className="border-t border-gray-200 pt-3">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Security Badges */}
                            <div className="border-t border-gray-200 pt-4">
                                <div className="flex items-center justify-center space-x-6 text-gray-400">
                                    <div className="text-center">
                                        <div className="text-2xl mb-1">🔒</div>
                                        <p className="text-xs">Secure Payment</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl mb-1">🛡️</div>
                                        <p className="text-xs">Guarantee</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl mb-1">📦</div>
                                        <p className="text-xs">Free Shipping</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}