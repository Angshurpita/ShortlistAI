import { FileText, Upload, ListChecks } from 'lucide-react';

const steps = [
  {
    icon: FileText,
    title: 'Connect Job Post',
    description: 'Integrate with your existing ATS like Greenhouse or Lever, or simply paste your job description directly into our portal.',
    step: '01',
  },
  {
    icon: Upload,
    title: 'Import Resumes',
    description: 'Upload bulk PDFs, sync applicant folders, or let us monitor your incoming applications in real-time. No limits.',
    step: '02',
  },
  {
    icon: ListChecks,
    title: 'View Ranked Shortlist',
    description: 'Our AI ranks candidates based on role requirements, giving you a score and specific reasoning for every person.',
    step: '03',
  },
];

export function HowItWorks() {
  return (
    <section id="product" className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600">
            Three simple steps to automate your recruiting pipeline and find the top 1% of talent instantly.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-blue-200 to-transparent" />
              )}

              <div className="relative">
                {/* Step Number Badge */}
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 text-white text-sm font-bold rounded-full flex items-center justify-center">
                  {step.step}
                </div>

                {/* Icon */}
                <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
                  <step.icon className="w-8 h-8 text-blue-600" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
