import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'STARTER',
    price: 49,
    period: '/mo',
    description: 'Perfect for individual recruiters or small teams starting with AI shortlisting.',
    features: [
      { text: '50 resumes processed per month', included: true },
      { text: 'Core AI Matching Engine', included: true },
      { text: 'Standard Email Support', included: true },
      { text: '1 User Seat', included: true },
      { text: 'Advanced AI Filters', included: false },
    ],
    cta: 'Start Free Trial',
    highlighted: false,
  },
  {
    name: 'PRO',
    price: 199,
    period: '/mo',
    description: 'Designed for growing agencies and departments needing scale and precision.',
    features: [
      { text: '500 resumes processed per month', included: true, highlight: true },
      { text: 'Advanced AI Predictive Filters', included: true },
      { text: 'Priority 24/7 Support', included: true },
      { text: '5 User Seats Included', included: true },
      { text: 'Custom Branding & CSV Export', included: true },
    ],
    cta: 'Get Started Pro',
    highlighted: true,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-600">
            Choose the plan that's right for your hiring team. Scale as you grow with AI-powered candidate filtering that saves hours of manual review.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
            <button className="px-4 py-2 bg-white rounded-md text-sm font-medium text-gray-900 shadow-sm">
              Monthly
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
              Yearly <span className="text-green-600">(Save 20%)</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative rounded-2xl p-8 ${
                plan.highlighted 
                  ? 'bg-white border-2 border-blue-600 shadow-xl' 
                  : 'bg-white border border-gray-200'
              }`}
            >
              {/* Popular Badge */}
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>
                <p className="text-gray-600 mt-3 text-sm">
                  {plan.description}
                </p>
              </div>

              {/* CTA Button */}
              <Link to="/login">
                <Button 
                  className={`w-full mb-8 ${
                    plan.highlighted 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                  variant={plan.highlighted ? 'default' : 'secondary'}
                >
                  {plan.cta}
                </Button>
              </Link>

              {/* Features List */}
              <ul className="space-y-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={`text-sm ${
                      feature.included 
                        ? feature.highlight 
                          ? 'text-blue-600 font-medium' 
                          : 'text-gray-700'
                        : 'text-gray-400'
                    }`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trust Logos */}
        <div className="mt-20 text-center">
          <p className="text-sm text-gray-500 uppercase tracking-wider mb-8">
            Trusted by recruitment teams at
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16 opacity-50">
            {['NEXUS', 'STRATOS', 'QUANTUM', 'SYNERGY'].map((logo) => (
              <div key={logo} className="text-xl font-bold text-gray-400">
                {logo}
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            {[
              {
                q: 'Can I upgrade or downgrade later?',
                a: 'Yes, you can change your plan at any time. If you upgrade, the new rate will be prorated for the current billing cycle. Downgrades take effect at the end of the current cycle.',
              },
              {
                q: 'What happens if I reach my resume limit?',
                a: 'Once you hit your limit, you can choose to upgrade to a higher tier or wait until the next billing cycle. We also offer one-time "top-up" packs for high-volume months.',
              },
              {
                q: 'Do you offer custom enterprise plans?',
                a: 'Absolutely. For teams processing more than 1,000 resumes per month, please contact our sales team for a custom solution tailored to your workflow.',
              },
            ].map((faq, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-2">{faq.q}</h4>
                <p className="text-gray-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
