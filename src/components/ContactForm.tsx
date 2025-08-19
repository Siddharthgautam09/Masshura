import { motion } from 'framer-motion';
import { Send, User, Building, Briefcase, Mail, Phone, MessageCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { useAllCategories } from '../hooks/useAdminCategories';

const ContactForm = () => {

  // Fetch business types from admin settings
  const { businessTypes } = useAllCategories();

  const initialFormState = {
    name: '',
    company: '',
    industry: '',
    email: '',
    phone: '',
    services: [],
    message: ''
  };
  const [formData, setFormData] = useState(initialFormState);

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const serviceOptions = [
    "Software Development & Consulting",
    "IT Hardware Supply", 
    "AMC (Hardware/Software Support)",
    "ERP, CRM, or SaaS",
    "Other"
  ];

  // Use businessTypes from admin settings as industry options
  const industryOptions = (businessTypes?.items || []).map((item) => typeof item === 'string' ? item : item.name).filter(Boolean);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleServiceChange = (service) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'contacts'), {
        ...formData,
        submittedAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch (error) {
      alert('Failed to submit. Please try again.');
      console.error('Contact form error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        className="bg-gradient-to-br from-green-500/20 to-[#6AAEFF]/20 backdrop-blur-sm rounded-3xl p-12 border border-green-500/30 text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
        <h3 className="text-3xl font-bold text-white mb-4">Message Sent Successfully!</h3>
        <p className="text-slate-300 text-lg leading-relaxed mb-8">
          Thank you for reaching out! Our IT experts will review your requirements and contact you within 4 hours with tailored solutions for your business.
        </p>
        <motion.button
          className="px-8 py-4 bg-[#6AAEFF] text-white rounded-xl font-semibold hover:bg-white hover:text-[#6AAEFF] transition-all duration-300 shadow-xl hover:shadow-[#6AAEFF]/30 border border-transparent hover:border-[#6AAEFF]"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setSubmitted(false);
            setFormData(initialFormState);
          }}
        >
          Send Another Message
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm rounded-3xl border border-slate-700/50">
      {/* SEO Meta Tags */}
      <title>Reach Out – Maashura IT Hardware, Software & Support Experts UAE & GCC</title>
      <meta name="description" content="Submit your query for IT consulting, hardware supply, ERP demos, or AMC support with Maashura. Serving UAE, Saudi, and across GCC." />

      {/* Form Header */}
      <motion.div
        className="p-8 pb-0"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-[#6AAEFF] rounded-xl">
            <Send className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-white">We're ready when you are.</h3>
            <p className="text-slate-300 text-lg">Let's build your IT ecosystem.</p>
          </div>
        </div>
      </motion.div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        
        {/* Personal Information Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
              <label className="text-slate-300 font-semibold mb-2 flex items-center">
              <User className="w-4 h-4 mr-2 text-[#6AAEFF]" />
              Name *
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-4 py-3 bg-slate-700/60 border border-slate-600/50 rounded-xl text-white focus:border-[#6AAEFF] focus:outline-none focus:ring-2 focus:ring-[#6AAEFF]/20 transition-all duration-300 placeholder-slate-400"
              placeholder="Your full name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
              <label className="text-slate-300 font-semibold mb-2 flex items-center">
              <Building className="w-4 h-4 mr-2 text-[#6AAEFF]" />
              Company *
            </label>
            <input
              type="text"
              name="company"
              required
              className="w-full px-4 py-3 bg-slate-700/60 border border-slate-600/50 rounded-xl text-white focus:border-[#6AAEFF] focus:outline-none focus:ring-2 focus:ring-[#6AAEFF]/20 transition-all duration-300 placeholder-slate-400"
              placeholder="Your company name"
              value={formData.company}
              onChange={handleInputChange}
            />
          </motion.div>
        </div>

        {/* Industry Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
            <label className="text-slate-300 font-semibold mb-2 flex items-center">
            <Briefcase className="w-4 h-4 mr-2 text-[#6AAEFF]" />
            Industry
          </label>
          <select 
            name="industry"
            className="w-full px-4 py-3 bg-slate-700/60 border border-slate-600/50 rounded-xl text-white focus:border-[#6AAEFF] focus:outline-none focus:ring-2 focus:ring-[#6AAEFF]/20 transition-all duration-300"
            value={formData.industry}
            onChange={handleInputChange}
          >
            <option value="">Select your industry</option>
            {industryOptions.map((industry, index) => (
              <option key={index} value={industry}>{industry}</option>
            ))}
          </select>
        </motion.div>

        {/* Contact Information Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
              <label className="text-slate-300 font-semibold mb-2 flex items-center">
              <Mail className="w-4 h-4 mr-2 text-[#6AAEFF]" />
              Email *
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-3 bg-slate-700/60 border border-slate-600/50 rounded-xl text-white focus:border-[#6AAEFF] focus:outline-none focus:ring-2 focus:ring-[#6AAEFF]/20 transition-all duration-300 placeholder-slate-400"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleInputChange}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
          >
              <label className="text-slate-300 font-semibold mb-2 flex items-center">
              <Phone className="w-4 h-4 mr-2 text-[#6AAEFF]" />
              Phone *
            </label>
            <input
              type="tel"
              name="phone"
              required
              className="w-full px-4 py-3 bg-slate-700/60 border border-slate-600/50 rounded-xl text-white focus:border-[#6AAEFF] focus:outline-none focus:ring-2 focus:ring-[#6AAEFF]/20 transition-all duration-300 placeholder-slate-400"
              placeholder="+971 XX XXX XXXX"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </motion.div>
        </div>

        {/* Services Interested In - Checkboxes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
        >
            <label className="text-slate-300 font-semibold mb-4 flex items-center">
            <CheckCircle className="w-4 h-4 mr-2 text-[#6AAEFF]" />
            Services Interested In *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {serviceOptions.map((service, index) => (
              <motion.div
                key={index}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                  formData.services.includes(service)
                    ? 'bg-[#6AAEFF]/20 border-[#6AAEFF] text-[#6AAEFF]'
                    : 'bg-slate-700/40 border-slate-600/50 text-slate-300 hover:border-[#6AAEFF]/50'
                }`}
                onClick={() => handleServiceChange(service)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 + 0.7 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                    formData.services.includes(service)
                      ? 'bg-[#6AAEFF] border-[#6AAEFF]'
                      : 'border-slate-400'
                  }`}>
                    {formData.services.includes(service) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <CheckCircle className="w-3 h-3 text-white" />
                      </motion.div>
                    )}
                  </div>
                  <span className="font-medium">{service}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Message Field */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          viewport={{ once: true }}
        >
            <label className="text-slate-300 font-semibold mb-2 flex items-center">
            <MessageCircle className="w-4 h-4 mr-2 text-[#6AAEFF]" />
            Message / Requirements *
          </label>
          <textarea
            name="message"
            required
            className="w-full px-4 py-3 bg-slate-700/60 border border-slate-600/50 rounded-xl text-white focus:border-[#6AAEFF] focus:outline-none focus:ring-2 focus:ring-[#6AAEFF]/20 transition-all duration-300 resize-vertical placeholder-slate-400"
            placeholder="Tell us about your IT requirements, current challenges, budget considerations, or specific goals. The more details you provide, the better we can assist you."
            value={formData.message}
            onChange={handleInputChange}
          />
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          viewport={{ once: true }}
        >
          <motion.button
            type="submit"
            disabled={isSubmitting || formData.services.length === 0}
            className="w-full px-8 py-4 bg-[#6AAEFF] text-white rounded-xl font-bold text-lg hover:bg-white hover:text-[#6AAEFF] transition-all duration-300 shadow-xl hover:shadow-[#6AAEFF]/30 border border-transparent hover:border-[#6AAEFF] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
          >
            {isSubmitting ? (
              <>
                <motion.div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span>Sending Message...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Get Started with Maashura</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Form Footer */}
        <motion.div
          className="pt-6 border-t border-slate-700/50 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center space-x-6 text-slate-400 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Free Consultation</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>4-Hour Response</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>GCC Coverage</span>
            </div>
          </div>
        </motion.div>
      </form>
    </div>
  );
};

export default ContactForm;
