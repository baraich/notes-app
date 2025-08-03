import React from "react";

const PrivacyAndTermsPage = () => {
  return (
    <div className="bg-gray-900 text-gray-100 font-sans leading-relaxed min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div
          className="bg-red-900 border-l-4 border-red-500 text-red-200 p-4 mb-8"
          role="alert"
        >
          <p className="font-bold">Disclaimer</p>
          <p>
            This is a template and not legally cross-checked. We will
            consult with a qualified legal professional to ensure your
            policies are compliant with all applicable laws and
            regulations, including FERPA, GDPR, and others relevant to
            your jurisdiction and user base.
          </p>
        </div>

        <h1 className="text-4xl font-bold mb-4 text-gray-100">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-400 mb-8">
          Last Updated: August 1, 2025
        </p>

        <p className="mb-6 text-gray-200">
          Welcome to our notes application (&quot;Service&quot;). We
          are committed to protecting the privacy of our users,
          especially students. This Privacy Policy explains what
          information we collect, how we use it, and your rights in
          relation to it.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-100">
          1. Information We Collect
        </h2>
        <ul className="list-disc list-inside space-y-2 mb-6 text-gray-200">
          <li>
            <strong>Account Information:</strong> When you sign up, we
            collect your name, university-provided email address, and
            hashed password.
          </li>
          <li>
            <strong>User-Generated Content:</strong> We collect and
            store the notes, text, images, and any other content you
            create or upload (&quot;Notes&quot;).
          </li>
          <li>
            <strong>AI Chat and Prompts:</strong> We collect the
            prompts, questions, and conversation history you submit to
            our AI-powered chat feature (&quot;AI Prompts&quot;).
          </li>
          <li>
            <strong>Usage and Technical Data:</strong> We
            automatically collect information about how you interact
            with our Service, such as your IP address, device type,
            browser information, and feature usage patterns.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-100">
          2. How We Use Your Information
        </h2>
        <p className="mb-6 text-gray-200">
          We use your information for the following purposes:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-6 text-gray-200">
          <li>To provide, operate, and maintain the Service.</li>
          <li>
            To process and respond to your AI Prompts through our AI
            feature.
          </li>
          <li>
            To improve and personalize the Service based on usage.
          </li>
          <li>
            To ensure the security of our platform and prevent abuse.
          </li>
          <li>
            To communicate with you about service updates, security
            alerts, and support.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-100">
          3. Data Sharing and Disclosure
        </h2>
        <p className="mb-6 text-gray-200">
          We do not sell your personal data. We only share it with the
          following parties for the purposes described below:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-6 text-gray-200">
          <li>
            <strong>OpenAI, L.L.C.:</strong> To power our AI chat
            feature, we send your AI Prompts to OpenAI&apos;s API. In
            accordance with OpenAI&apos;s API data usage policies,
            they do not use data submitted via their API to train
            their models. We do not share your account information or
            personal identifiers with OpenAI.
          </li>
          <li>
            <strong>Your University:</strong> We may share aggregated
            and anonymized usage statistics with your university to
            demonstrate the value and utilization of the Service. We
            will not share your personal Notes or other User-Generated
            Content with your university unless required by law or for
            a formal academic integrity investigation as mandated by
            the university.
          </li>
          <li>
            <strong>Service Providers:</strong> We use third-party
            vendors for services like cloud hosting and analytics.
            These providers only have access to the information
            necessary to perform their functions and are contractually
            obligated to protect your data.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-100">
          4. Student Data and Intellectual Property
        </h2>
        <p className="mb-6 text-gray-200">
          <strong>
            You own the intellectual property of the Notes and
            User-Generated Content you create.
          </strong>{" "}
          We do not claim any ownership over your work. You grant us a
          limited, royalty-free license to store, display, and use
          your content solely for the purpose of providing the Service
          to you.
        </p>

        <hr className="my-12 border-gray-700" />

        <h1 className="text-4xl font-bold mb-4 text-gray-100">
          Terms of Service
        </h1>
        <p className="text-sm text-gray-400 mb-8">
          Last Updated: August 1, 2025
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-100">
          1. Acceptance of Terms
        </h2>
        <p className="mb-6 text-gray-200">
          By using our Service, you agree to be bound by these Terms
          of Service. If you do not agree, do not use the Service.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-100">
          2. Acceptable Use and Academic Integrity
        </h2>
        <p className="mb-6 text-gray-200">
          You agree not to use the Service for any illegal purpose or
          to violate any laws. Crucially, you agree to uphold the
          principles of academic integrity.
        </p>
        <ul className="list-disc list-inside space-y-2 mb-6 text-gray-200">
          <li>
            The AI feature is a tool to assist your learning and
            research. It is not a tool for cheating or plagiarism.
          </li>
          <li>
            You are responsible for the originality and integrity of
            all academic work you submit.
          </li>
          <li>
            Using the Service to represent AI-generated content as
            your own original work in an academic setting is a
            violation of these terms and your university&apos;s
            academic integrity policy.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-100">
          3. AI Feature Usage
        </h2>
        <ul className="list-disc list-inside space-y-2 mb-6 text-gray-200">
          <li>
            <strong>Disclaimer of Accuracy:</strong> The content
            generated by the AI is for informational purposes only. It
            may contain errors, inaccuracies, or biases. You must
            independently verify any information you rely on.
          </li>
          <li>
            <strong>No Liability:</strong> We are not liable for any
            damages or losses arising from your use of the AI feature
            or any reliance on the information it provides.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-100">
          4. Intellectual Property
        </h2>
        <p className="mb-6 text-gray-200">
          As stated in our Privacy Policy, you own your content. We
          own the Service, including our branding, code, and all other
          aspects of the application. You may not copy, modify, or
          reverse-engineer our Service.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-100">
          5. Termination
        </h2>
        <p className="mb-6 text-gray-200">
          We reserve the right to suspend or terminate your account at
          any time for any reason, particularly for violations of our
          Acceptable Use and Academic Integrity policy. You can delete
          your account at any time.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-100">
          6. Disclaimer of Warranties
        </h2>
        <p className="mb-6 text-gray-200">
          The Service is provided &quot;as-is&quot; without any
          warranties of any kind. We do not guarantee that the service
          will be uninterrupted or error-free.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-100">
          7. Contact Us
        </h2>
        <p className="mb-6 text-gray-200">
          If you have any questions about these Terms or our Privacy
          Policy, please contact us at [Your Contact Email Address].
        </p>
      </div>
    </div>
  );
};

export default PrivacyAndTermsPage;
