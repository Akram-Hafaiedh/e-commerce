export default function FeaturesSection() {
    const features = [
        {
            icon: "🚚",
            title: "Free Shipping",
            description: "Free shipping on orders over $50",
            color: "from-green-400 to-green-600",
            bgColor: "bg-green-50"
        },
        {
            icon: "🔒",
            title: "Secure Payment",
            description: "100% secure payment processing",
            color: "from-blue-400 to-blue-600",
            bgColor: "bg-blue-50"
        },
        {
            icon: "↩️",
            title: "Easy Returns",
            description: "30-day hassle-free return policy",
            color: "from-purple-400 to-purple-600",
            bgColor: "bg-purple-50"
        },
        {
            icon: "📞",
            title: "24/7 Support",
            description: "Round-the-clock customer support",
            color: "from-orange-400 to-orange-600",
            bgColor: "bg-orange-50"
        }
    ]
    return (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Why Choose <span className="text-blue-600">ShopStore</span>?
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        We&apos;re committed to providing the best shopping experience for our customers
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="text-center group"
                            style={{
                                animationDelay: `${index * 150}ms`,
                                animation: 'fadeInUp 0.6s ease-out forwards'
                            }}
                        >
                            <div className={`relative mb-6 ${feature.bgColor} rounded-2xl p-8 group-hover:shadow-lg transition-all duration-300 group-hover:translate-y-[-4px]`}>
                                <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <span className="text-2xl">{feature.icon}</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>

                                {/* Hover effect line */}
                                <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r ${feature.color} group-hover:w-3/4 transition-all duration-300 rounded-full`}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}