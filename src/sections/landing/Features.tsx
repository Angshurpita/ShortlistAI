import { Shield, BarChart3, Zap, Settings, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Bias-Free Evaluation',
    description: 'Our LLMs focus purely on competency and experience, ensuring every candidate gets a fair shot based on merit.',
    image: 'bias-free',
  },
  {
    icon: BarChart3,
    title: 'Deep Insights',
    description: 'Detailed scoring explanations for every single applicant, helping you understand the why behind each ranking.',
    image: 'insights',
  },
  {
    icon: Zap,
    title: 'Seamless Sync',
    description: 'Sync back to your ATS instantly. No duplicate data entry, no manual exports, just pure efficiency.',
    image: 'sync',
  },
  {
    icon: Settings,
    title: 'Custom Scoring Models',
    description: 'Define what matters to your culture. Set custom weightings for technical skills, soft skills, or years of industry experience.',
    image: 'custom',
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 lg:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16">
          <div className="max-w-xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Built for High-Growth Teams
            </h2>
            <p className="text-lg text-gray-600">
              Powerful features that help you hire better, faster, and without the bias of manual screening.
            </p>
          </div>
          <a 
            href="#pricing" 
            className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 mt-4 lg:mt-0"
          >
            Explore all features
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                <feature.icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                {feature.description}
              </p>

              {/* Feature Visual */}
              <div className="relative h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden">
                {feature.image === 'bias-free' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex gap-4">
                      {['A', 'B', 'C', 'D'].map((letter, i) => (
                        <div 
                          key={i} 
                          className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold"
                        >
                          {letter}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {feature.image === 'insights' && (
                  <div className="absolute inset-0 flex items-end justify-center pb-4 px-4">
                    <div className="flex items-end gap-2 w-full justify-center">
                      {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                        <div 
                          key={i} 
                          className="w-6 bg-blue-500 rounded-t"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {feature.image === 'sync' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Zap className="w-8 h-8 text-blue-600" />
                      </div>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                        <div className="text-green-600 font-bold text-xs">ATS</div>
                      </div>
                    </div>
                  </div>
                )}
                {feature.image === 'custom' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="space-y-2 w-3/4">
                      {['Technical Skills', 'Soft Skills', 'Experience'].map((label, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 w-24">{label}</span>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${[80, 60, 90][i]}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
