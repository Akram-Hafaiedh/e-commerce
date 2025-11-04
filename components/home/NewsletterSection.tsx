'use client';

import { useState } from 'react';

export default function NewsletterSection() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessageType('success');
                setMessage(data.message || 'Successfully subscribed!');
                setEmail('');
            } else {
                setMessageType('error');
                setMessage(data.error || 'Something went wrong');
            }
        } catch (error) {
            setMessageType('error');
            setMessage('Failed to subscribe. Please try again.');
            console.error('Newsletter error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-48 h-48 bg-white rounded-full transform translate-x-1/2 translate-y-1/2"></div>
            </div>

            <div className="relative container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/30">
                        <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                        <span className="text-sm font-medium">Stay Updated</span>
                    </div>

                    <h2 className="text-5xl font-bold mb-6">
                        Join the <span className="text-yellow-300">ShopStore</span> Family
                    </h2>

                    <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
                        Subscribe to our newsletter and be the first to know about exclusive deals, new arrivals, and special promotions.
                    </p>

                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
                        <div onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                            <div className="flex-1 relative">
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="text-white w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-400/30 transition-all duration-300 shadow-lg bg-white/5"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-xl hover:bg-yellow-300 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-yellow-500/25 hover:scale-105 flex items-center gap-2 justify-center min-w-[160px] disabled:opacity-50 disabled:scale-100"
                            >
                                <span>{loading ? 'Subscribing...' : 'Subscribe Now'}</span>
                                {!loading && (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        {message && (
                            <p className={`text-sm mt-4 flex items-center justify-center gap-2 ${messageType === 'success' ? 'text-green-300' : 'text-red-300'}`}>
                                <span>{messageType === 'success' ? '✓' : '✕'}</span>
                                {message}
                            </p>
                        )}

                        {!message && (
                            <p className="text-sm opacity-80 mt-4 flex items-center justify-center gap-2">
                                <span>✨</span>
                                Join 10,000+ subscribers. No spam, unsubscribe at any time.
                            </p>
                        )}
                    </div>

                    <div className="flex flex-wrap justify-center gap-8 mt-12 opacity-90">
                        {[
                            { icon: '🔒', text: 'Secure' },
                            { icon: '📧', text: 'One-click unsubscribe' },
                            { icon: '🎁', text: 'Exclusive offers' }
                        ].map((badge, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                                <span>{badge.icon}</span>
                                <span>{badge.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}