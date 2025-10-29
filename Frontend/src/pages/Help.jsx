import React, { useState } from 'react';

const Help = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: 'How do I change my interests?',
      a: 'Go to Profile → Edit Interests → Save.'
    },
    {
      q: 'I can’t see any companions!',
      a: 'Try exploring all interests or check your internet connection.'
    },
    {
      q: 'How do I send a message?',
      a: 'Open a companion’s card → Click “Message” → Start chatting.'
    },
    {
      q: 'How do I delete my account?',
      a: 'Go to Settings → Delete Account.'
    }
  ];

  const toggle = (idx) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="min-h-screen bg-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header / Title */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-white mb-3">
            Need Help? We’re Here for You!
          </h1>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Welcome to the Companion Connect Help Center. Find answers to common questions, or reach out to our support team for assistance.
          </p>
        </div>

        {/* How It Works */}
        <div className="bg-slate-700/60 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-slate-600">
          <h2 className="text-2xl font-semibold text-white mb-4">How It Works</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-200">
            <li>Sign up & create your profile</li>
            <li>Select your interests</li>
            <li>Explore companions with similar interests</li>
            <li>Send messages or connect</li>
            <li>Manage your profile & privacy</li>
          </ol>
          <p className="text-gray-300 mt-4">
            Companion Connect helps you meet like-minded people. After signing up, choose your interests — such as music, travel, or books. You’ll then see companions who share the same passions.
          </p>
        </div>

        {/* FAQ - Accordion */}
        <div className="bg-slate-700/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-600">
          <h2 className="text-2xl font-semibold text-white mb-4">Frequently Asked Questions (FAQ)</h2>

          <div className="divide-y divide-slate-600 rounded-xl border border-slate-600 overflow-hidden">
            {faqs.map((item, idx) => (
              <div key={idx} className="bg-slate-700/30">
                <button
                  className="w-full flex items-center justify-between text-left px-4 py-4 md:px-6 md:py-5 hover:bg-slate-700/50 focus:outline-none"
                  aria-expanded={openIndex === idx}
                  aria-controls={`faq-panel-${idx}`}
                  id={`faq-button-${idx}`}
                  onClick={() => toggle(idx)}
                >
                  <span className="text-white font-medium pr-4">{item.q}</span>
                  <span
                    className={`ml-4 h-5 w-5 shrink-0 rounded-full border border-slate-500 text-gray-300 flex items-center justify-center transition-transform ${
                      openIndex === idx ? 'rotate-45' : ''
                    }`}
                  >
                    +
                  </span>
                </button>
                {openIndex === idx && (
                  <div
                    id={`faq-panel-${idx}`}
                    role="region"
                    aria-labelledby={`faq-button-${idx}`}
                    className="px-4 pb-4 md:px-6 md:pb-5 text-gray-200"
                  >
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;


