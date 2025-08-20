import { motion } from 'framer-motion';
import SEO from '@/components/Seo';
import { Upload, FileText, Check, User, Building, Globe, Phone, Mail, Shield, ArrowRight, Paperclip, CheckCircle, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../components/firebase';
import { useToast } from "@/components/ui/use-toast";
import { useAllCategories } from '../hooks/useAdminCategories';
import emailjs from '@emailjs/browser';

const SupplierRegistration = () => {
  const { toast } = useToast();
  const { countries, emirates, yearsInOperation, employeeCount, supplyCategories, countryCodes, loading: categoriesLoading } = useAllCategories();
  const [formData, setFormData] = useState({
    companyName: '',
    country: '',
    emirate: '',
    website: '',
    tradeNumber: '',
    yearsOperation: '',
    employeeCount: '',
    contactPerson: '',
    designation: '',
    email: '',
    countryCode: '',
    phone: '',
    categories: [],
    tradeLicense: null,
    catalog: null,
    confirmAccuracy: false,
    agreeContact: false
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState({ tradeLicense: false, catalog: false });
  const [renewalPlans, setRenewalPlans] = useState([]);
  const [selectedRenewalPlan, setSelectedRenewalPlan] = useState('');
  const [registrationAmount, setRegistrationAmount] = useState(500); // Default value

  // Fetch renewal plans and registration amount
  useEffect(() => {
    const fetchRenewalPlans = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, 'settings', 'subscriptions'));
        if (settingsDoc.exists()) {
          const data = settingsDoc.data();
          const activeRenewalPlans = (data.renewalAmounts || []).filter(renewal => renewal.isActive);
          setRenewalPlans(activeRenewalPlans);
          // Set default selection to first renewal plan
          if (activeRenewalPlans.length > 0) {
            setSelectedRenewalPlan(activeRenewalPlans[0].id);
          }
          // Fetch registration amount (keeping this as default)
          if (data.registrationAmount) {
            setRegistrationAmount(data.registrationAmount);
          }
        }
      } catch (error) {
        console.error('Error fetching renewal plans:', error);
      }
    };

    fetchRenewalPlans();
  }, []);

  const handleFileUpload = async (file, type) => {
    setUploading(prev => ({ ...prev, [type]: true }));
    
    try {
      // For now, we'll store the file as base64 in Firestore
      // In production, you should use Cloud Storage
      const reader = new FileReader();
      
      reader.onload = () => {
        const result = reader.result;
        
        // Update form data with file data
        setFormData(prev => ({
          ...prev,
          [type]: {
            data: result, // Base64 data
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            uploadedAt: new Date().toISOString()
          }
        }));
        
        toast({
          title: "Upload Successful",
          description: `${type === 'tradeLicense' ? 'Trade License' : 'Catalog'} uploaded successfully.`,
        });
        
        setUploading(prev => ({ ...prev, [type]: false }));
      };
      
      reader.onerror = () => {
        toast({
          title: "Upload Failed",
          description: `Failed to upload ${type === 'tradeLicense' ? 'Trade License' : 'Catalog'}. Please try again.`,
          variant: "destructive",
        });
        setUploading(prev => ({ ...prev, [type]: false }));
      };
      
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: `Failed to upload ${type === 'tradeLicense' ? 'Trade License' : 'Catalog'}. Please try again.`,
        variant: "destructive",
      });
      setUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      if (validateFile(file, type)) {
        handleFileUpload(file, type);
      }
    }
  };

  const handleFileSelect = (e, type) => {
    const file = e.target.files[0];
    if (file && validateFile(file, type)) {
      handleFileUpload(file, type);
    }
  };

  const validateFile = (file, type) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "Please select a file smaller than 10MB.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please select a PDF, JPG, or PNG file.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.companyName || !formData.email || !formData.phone || !formData.contactPerson) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      if (formData.categories.length === 0) {
        toast({
          title: "Validation Error", 
          description: "Please select at least one supply category.",
          variant: "destructive",
        });
        return;
      }

      if (!formData.tradeLicense) {
        toast({
          title: "Validation Error",
          description: "Please upload your trade license copy.",
          variant: "destructive",
        });
        return;
      }

      if (!formData.confirmAccuracy || !formData.agreeContact) {
        toast({
          title: "Validation Error",
          description: "Please confirm accuracy and agree to be contacted.",
          variant: "destructive",
        });
        return;
      }

      if (!selectedRenewalPlan) {
        toast({
          title: "Validation Error",
          description: "Please select a renewal plan.",
          variant: "destructive",
        });
        return;
      }

      // Generate a reference number
      const refNo = `SUP-${Date.now()}`;
      
      // Get selected renewal plan data
      const selectedPlanData = renewalPlans.find(plan => plan.id === selectedRenewalPlan);
      
      // Prepare data for Firestore
      const supplierData = {
        ...formData,
        refNo,
        status: 'pending_approval',
        selectedRenewalPlan: selectedPlanData,
        renewalAmount: selectedPlanData?.amount || 0,
        renewalDuration: selectedPlanData?.years || 1,
        registrationAmount: registrationAmount,
        paymentStatus: 'pending',
        createdAt: new Date().toISOString(),
        submittedAt: new Date().toISOString(),
        tradeLicense: formData.tradeLicense || null,
        catalog: formData.catalog || null,
        isActive: false, // Inactive until approved by admin
        expiryDate: null, // Will be set when accepted and payment is made
      };

      // Save to Firestore
      const docRef = await addDoc(collection(db, 'suppliers'), supplierData);
      
      toast({
        title: "Success!",
        description: `Registration submitted successfully. Reference: ${refNo}`,
      });

      // Send confirmation email to supplier
      try {
        const YOUR_SERVICE_ID = "service_6qlid92";
        const YOUR_TEMPLATE_ID = "template_h01qmqi";      // Account Setup template
        const YOUR_PUBLIC_KEY = "v5gxhy3P54twB8u7I";

        // Initialize EmailJS
        emailjs.init(YOUR_PUBLIC_KEY);

        // Template parameters for registration confirmation email
        const templateParams = {
          supplier_name: formData.contactPerson,
          to_email: formData.email,
          company_name: formData.companyName,
          ref_no: refNo,
          submission_date: new Date().toLocaleDateString(),
          from_name: "Masshura Team"
        };

        // Send confirmation email
        await emailjs.send(YOUR_SERVICE_ID, YOUR_TEMPLATE_ID, templateParams);
        console.log('Registration confirmation email sent successfully');
        
        toast({
          title: "Email Sent",
          description: "A confirmation email has been sent to your registered email address.",
        });
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // Don't fail the registration if email fails
        toast({
          title: "Registration Successful",
          description: "Registration submitted successfully, but confirmation email could not be sent.",
          variant: "default",
        });
      }

      setSubmitted(true);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryChange = (category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  if (submitted) {
    return (
      <section className="relative bg-slate-900 min-h-screen overflow-hidden">
        <title>Supplier Registration – Partner with Maashura Digital Clarity & IT Consultancy in UAE & GCC</title>
        <meta name="description" content="Join Maashura as a supplier or development partner. Fill out the supplier registration form to work with clients across UAE, Saudi Arabia, and the GCC." />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <motion.div
            className="max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-gradient-to-br from-green-500/20 to-[#6AAEFF]/20 backdrop-blur-sm rounded-3xl p-12 border border-green-500/30">
              <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
              <h1 className="text-4xl font-bold text-white mb-6">Registration Successful!</h1>
              <p className="text-slate-300 text-lg leading-relaxed mb-8">
                Thank you! Your supplier registration form has been submitted successfully. Our procurement or partnership team will contact you shortly.
              </p>
              <motion.button
                className="px-8 py-4 bg-[#6AAEFF] text-white rounded-xl font-semibold hover:bg-white hover:text-[#6AAEFF] transition-all duration-300 shadow-xl hover:shadow-[#6AAEFF]/30 border border-transparent hover:border-[#6AAEFF]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    companyName: '',
                    country: '',
                    emirate: '',
                    website: '',
                    tradeNumber: '',
                    yearsOperation: '',
                    employeeCount: '',
                    contactPerson: '',
                    designation: '',
                    email: '',
                    countryCode: '',
                    phone: '',
                    categories: [],
                    tradeLicense: null,
                    catalog: null,
                    confirmAccuracy: false,
                    agreeContact: false
                  });
                }}
              >
                Submit Another Application
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <>
      <SEO
        title="Supplier Registration Dubai - IT Hardware Suppliers UAE | Maashura"
        description="Join Maashura's supplier network in Dubai for IT hardware, software distribution across UAE."
        keywords="supplier registration Dubai, IT hardware suppliers UAE"
        canonical="https://www.Maashura.com/supplier-registration/"
      />
      <section className="relative bg-slate-900 min-h-screen overflow-hidden navbar-content-spacing">
      {/* SEO Meta Tags */}
      <title>Supplier Registration – Partner with Maashura Digital Clarity & IT Consultancy in UAE & GCC</title>
      <meta name="description" content="Join Maashura as a supplier or development partner. Fill out the supplier registration form to work with clients across UAE, Saudi Arabia, and the GCC." />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
        
        {/* Header Section - Centered and Aligned */}
        <div className="max-w-5xl mx-auto mb-16">
          <motion.div
            className="text-center space-y-8"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#f8fafc] leading-tight">
              Become a <span className="text-[#6AAEFF]">Trusted Supplier</span> or Partner in the GCC
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
              {/* Main Content - 3 columns */}
              <div className="lg:col-span-3">
                <div className="bg-gradient-to-r from-slate-800/60 via-slate-700/40 to-slate-800/60 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
                  <p className="text-lg text-slate-300 leading-relaxed mb-6">
                    If you're actively looking to expand your IT business in the Middle East, register as a supplier or technology partner with <strong className="text-[#6AAEFF]">Maashura</strong>. We collaborate with companies that specialize in software development, hardware supply, AMC services, and infrastructure support.
                  </p>
                  
                  <p className="text-lg text-slate-400 leading-relaxed">
                    Our clients include real estate firms, facilities management companies, trading houses, clinics, and educational institutions. Join us to tap into genuine project opportunities in Dubai, Riyadh, Abu Dhabi, Muscat, and other regional hubs.
                  </p>
                </div>
              </div>

              {/* Side Info Panel - 1 column */}
              <motion.div
                className="lg:col-span-1"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="bg-[#6AAEFF]/10 backdrop-blur-sm rounded-3xl p-6 border border-[#6AAEFF]/30">
                  <Shield className="w-12 h-12 text-[#6AAEFF] mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-white mb-4 text-center">Quick Facts</h3>
                  
                  <div className="space-y-3">
                    {[
                      { icon: Globe, text: "GCC-wide opportunities" },
                      { icon: Building, text: "Established client network" },
                      { icon: CheckCircle, text: "Quality partnerships" },
                      { icon: ArrowRight, text: "Fast approval process" }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center space-x-3 text-slate-300"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <item.icon className="w-4 h-4 text-[#6AAEFF] flex-shrink-0" />
                        <span className="text-sm">{item.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Registration Form - Centered */}
        <motion.div
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <form onSubmit={handleSubmit} className="space-y-12">
            
            {/* Company Information - Hexagonal Cards */}
            <motion.div
              className="bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-4 mb-8">
                <div className="p-3 bg-[#6AAEFF] rounded-xl">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">🔹 Company Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-2">Company Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-slate-700/60 border border-slate-600/50 rounded-xl text-white focus:border-[#6AAEFF] focus:outline-none focus:ring-2 focus:ring-[#6AAEFF]/20 transition-all duration-300"
                    placeholder="Enter your company name"
                    value={formData.companyName}
                    onChange={(e) => setFormData(prev => ({...prev, companyName: e.target.value}))}
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-2">Years in Operation</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-700/60 border border-slate-600/50 rounded-xl text-white focus:border-[#6AAEFF] focus:outline-none focus:ring-2 focus:ring-[#6AAEFF]/20 transition-all duration-300"
                    value={formData.yearsOperation}
                    onChange={(e) => setFormData(prev => ({...prev, yearsOperation: e.target.value}))}
                  >
                    <option value="">Select years</option>
                    {categoriesLoading ? (
                      <option value="">Loading...</option>
                    ) : (
                      yearsInOperation.items.map(item => (
                        <option key={item.id} value={item.name}>{item.name}</option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-2">Country of Operation</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-700/60 border border-slate-600/50 rounded-xl text-white focus:border-[#6AAEFF] focus:outline-none focus:ring-2 focus:ring-[#6AAEFF]/20 transition-all duration-300"
                    value={formData.country}
                    onChange={(e) => setFormData(prev => ({...prev, country: e.target.value}))}
                  >
                    <option value="">Select country</option>
                    {categoriesLoading ? (
                      <option value="">Loading...</option>
                    ) : (
                      countries.items.map(item => (
                        <option key={item.id} value={item.name}>{item.name}</option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-2">Country Code</label>
                  <select
                    value={formData.countryCode}
                    onChange={(e) => setFormData(prev => ({...prev, countryCode: e.target.value}))}
                    className="w-full px-4 py-3 bg-slate-700/60 border border-slate-600/50 rounded-xl text-white focus:border-[#6AAEFF] focus:outline-none focus:ring-2 focus:ring-[#6AAEFF]/20 transition-all duration-300"
                  >
                    <option value="">Select country code</option>
                    {categoriesLoading ? (
                      <option value="">Loading...</option>
                    ) : countryCodes.items.length === 0 ? (
                      <option value="+971">�� +971 (UAE) - Default</option>
                    ) : (
                      countryCodes.items.map(item => (
                        <option key={item.id} value={item.name}>{item.name}</option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-2">Emirate (if UAE)</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-700/60 border border-slate-600/50 rounded-xl text-white focus:border-[#6AAEFF] focus:outline-none focus:ring-2 focus:ring-[#6AAEFF]/20 transition-all duration-300"
                    value={formData.emirate}
                    onChange={(e) => setFormData(prev => ({...prev, emirate: e.target.value}))}
                  >
                    <option value="">Select emirate</option>
                    {categoriesLoading ? (
                      <option value="">Loading...</option>
                    ) : (
                      emirates.items.map(item => (
                        <option key={item.id} value={item.name}>{item.name}</option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-2">Number of Employees</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-700/60 border border-slate-600/50 rounded-xl text-white focus:border-[#6AAEFF] focus:outline-none focus:ring-2 focus:ring-[#6AAEFF]/20 transition-all duration-300"
                    value={formData.employeeCount}
                    onChange={(e) => setFormData(prev => ({...prev, employeeCount: e.target.value}))}
                  >
                    <option value="">Select employee range</option>
                    {categoriesLoading ? (
                      <option value="">Loading...</option>
                    ) : (
                      employeeCount.items.map(item => (
                        <option key={item.id} value={item.name}>{item.name}</option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-2">Company Website</label>
                  <input
                    type="url"
                    className="w-full px-4 py-3 bg-slate-700/60 border border-slate-600/50 rounded-xl text-white focus:border-[#6AAEFF] focus:outline-none focus:ring-2 focus:ring-[#6AAEFF]/20 transition-all duration-300"
                    placeholder="https://www.yourcompany.com"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({...prev, website: e.target.value}))}
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-2">Trade License / Registration Number</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-slate-700/60 border border-slate-600/50 rounded-xl text-white focus:border-[#6AAEFF] focus:outline-none focus:ring-2 focus:ring-[#6AAEFF]/20 transition-all duration-300"
                    placeholder="Enter license number"
                    value={formData.tradeNumber}
                    onChange={(e) => setFormData(prev => ({...prev, tradeNumber: e.target.value}))}
                  />
                </div>
              </div>
            </motion.div>

            {/* Contact Details - Side by Side Layout */}
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-[#6AAEFF]/10 to-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border border-[#6AAEFF]/30">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-3 bg-[#6AAEFF] rounded-xl">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">🔹 Contact Details</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-2">Contact Person Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-slate-700/60 border border-slate-600/50 rounded-xl text-white focus:border-[#6AAEFF] focus:outline-none focus:ring-2 focus:ring-[#6AAEFF]/20 transition-all duration-300"
                      placeholder="Full name"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData(prev => ({...prev, contactPerson: e.target.value}))}
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-2">Designation</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-slate-700/60 border border-slate-600/50 rounded-xl text-white focus:border-[#6AAEFF] focus:outline-none focus:ring-2 focus:ring-[#6AAEFF]/20 transition-all duration-300"
                      placeholder="Job title"
                      value={formData.designation}
                      onChange={(e) => setFormData(prev => ({...prev, designation: e.target.value}))}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-3 bg-[#6AAEFF] rounded-xl">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Communication</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-2">Email Address *</label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 bg-slate-700/60 border border-slate-600/50 rounded-xl text-white focus:border-[#6AAEFF] focus:outline-none focus:ring-2 focus:ring-[#6AAEFF]/20 transition-all duration-300"
                      placeholder="email@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-2">Phone Number / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      className="w-full px-4 py-3 bg-slate-700/60 border border-slate-600/50 rounded-xl text-white focus:border-[#6AAEFF] focus:outline-none focus:ring-2 focus:ring-[#6AAEFF]/20 transition-all duration-300"
                      placeholder="XX XXX XXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                    />
                    <p className="text-slate-400 text-sm mt-2">
                      Full number will be: {formData.countryCode} {formData.phone}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Category Selection - Unique Grid Layout */}
            <motion.div
              className="bg-gradient-to-r from-slate-800/60 via-slate-700/40 to-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-4 mb-8">
                <div className="p-3 bg-[#6AAEFF] rounded-xl">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">🔹 Category of Supply</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {categoriesLoading ? (
                  <div className="col-span-full flex justify-center items-center py-8">
                    <div className="text-slate-300">Loading categories...</div>
                  </div>
                ) : supplyCategories.items.length === 0 ? (
                  <div className="col-span-full flex justify-center items-center py-8">
                    <div className="text-slate-300">No supply categories available. Please contact admin.</div>
                  </div>
                ) : (
                  supplyCategories.items.map((category) => (
                    <motion.div
                      key={category.id}
                      className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                        formData.categories.includes(category.name)
                          ? 'bg-[#6AAEFF]/20 border-[#6AAEFF] text-[#6AAEFF]'
                          : 'bg-slate-700/60 border-slate-600/50 text-slate-300 hover:border-[#6AAEFF]/50'
                      }`}
                      onClick={() => handleCategoryChange(category.name)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                          formData.categories.includes(category.name)
                            ? 'bg-[#6AAEFF] border-[#6AAEFF]'
                            : 'border-slate-400'
                        }`}>
                          {formData.categories.includes(category.name) && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span className="text-sm font-medium">{category.name}</span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>

            {/* File Uploads - Different Layout */}
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-3 bg-[#6AAEFF] rounded-xl">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">🔹 Supporting Documents</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-3">Upload Trade License Copy (PDF/JPG)</label>
                    <div 
                      className="border-2 border-dashed border-slate-600 rounded-xl p-6 text-center hover:border-[#6AAEFF]/50 transition-colors cursor-pointer relative"
                      onDrop={(e) => handleDrop(e, 'tradeLicense')}
                      onDragOver={(e) => e.preventDefault()}
                      onDragEnter={(e) => e.preventDefault()}
                      onClick={() => document.getElementById('tradeLicense').click()}
                    >
                      <input
                        type="file"
                        id="tradeLicense"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileSelect(e, 'tradeLicense')}
                      />
                      {uploading.tradeLicense ? (
                        <div className="flex flex-col items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6AAEFF] mb-2"></div>
                          <p className="text-[#6AAEFF] text-sm">Uploading...</p>
                        </div>
                      ) : formData.tradeLicense ? (
                        <div className="flex flex-col items-center">
                          <CheckCircle className="w-8 h-8 text-green-400 mb-2" />
                          <p className="text-green-400 text-sm font-medium">{formData.tradeLicense.fileName}</p>
                          <p className="text-slate-400 text-xs">({(formData.tradeLicense.fileSize / 1024 / 1024).toFixed(2)} MB)</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Paperclip className="w-8 h-8 text-slate-400 mb-2" />
                          <p className="text-slate-400 text-sm">Click to upload or drag and drop</p>
                          <p className="text-slate-500 text-xs mt-1">PDF, JPG, PNG (max 10MB)</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-3">Upload Product Catalog / Company Profile (Optional)</label>
                    <div 
                      className="border-2 border-dashed border-slate-600 rounded-xl p-6 text-center hover:border-[#6AAEFF]/50 transition-colors cursor-pointer relative"
                      onDrop={(e) => handleDrop(e, 'catalog')}
                      onDragOver={(e) => e.preventDefault()}
                      onDragEnter={(e) => e.preventDefault()}
                      onClick={() => document.getElementById('catalog').click()}
                    >
                      <input
                        type="file"
                        id="catalog"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileSelect(e, 'catalog')}
                      />
                      {uploading.catalog ? (
                        <div className="flex flex-col items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6AAEFF] mb-2"></div>
                          <p className="text-[#6AAEFF] text-sm">Uploading...</p>
                        </div>
                      ) : formData.catalog ? (
                        <div className="flex flex-col items-center">
                          <CheckCircle className="w-8 h-8 text-green-400 mb-2" />
                          <p className="text-green-400 text-sm font-medium">{formData.catalog.fileName}</p>
                          <p className="text-slate-400 text-xs">({(formData.catalog.fileSize / 1024 / 1024).toFixed(2)} MB)</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <FileText className="w-8 h-8 text-slate-400 mb-2" />
                          <p className="text-slate-400 text-sm">Click to upload or drag and drop</p>
                          <p className="text-slate-500 text-xs mt-1">PDF, JPG, PNG (max 10MB)</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Renewal Plan Selection */}
              <div className="bg-gradient-to-br from-[#6AAEFF]/10 to-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border border-[#6AAEFF]/30">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-3 bg-[#6AAEFF] rounded-xl">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">🔹 Select Renewal Plan</h2>
                </div>

                <div className="space-y-4">
                  {renewalPlans.map((plan) => (
                    <label
                      key={plan.id}
                      className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedRenewalPlan === plan.id
                          ? 'border-blue-400 bg-blue-500/10'
                          : 'border-slate-500 bg-slate-700/30 hover:bg-slate-700/50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="renewalPlan"
                          value={plan.id}
                          checked={selectedRenewalPlan === plan.id}
                          onChange={(e) => setSelectedRenewalPlan(e.target.value)}
                          className="text-blue-600"
                          required
                        />
                        <div>
                          <div className="text-white font-medium">{plan.label}</div>
                          <div className="text-slate-400 text-sm">
                            {plan.years} year{plan.years > 1 ? 's' : ''} renewal plan
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-blue-400 font-bold text-lg">₹{plan.amount}</div>
                        <div className="text-slate-400 text-xs">
                          ₹{Math.round(plan.amount / plan.years)} per year
                        </div>
                      </div>
                    </label>
                  ))}
                  {renewalPlans.length === 0 && (
                    <div className="text-slate-400 text-center py-4">
                      Loading renewal plans...
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#6AAEFF]/10 to-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border border-[#6AAEFF]/30">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-3 bg-[#6AAEFF] rounded-xl">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">🔹 Agreement Confirmation</h2>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="confirmAccuracy"
                      className="w-5 h-5 rounded border-2 border-slate-400 bg-slate-700 text-[#6AAEFF] focus:ring-[#6AAEFF] focus:ring-2 mt-1"
                      checked={formData.confirmAccuracy}
                      onChange={(e) => setFormData(prev => ({...prev, confirmAccuracy: e.target.checked}))}
                    />
                    <label htmlFor="confirmAccuracy" className="text-slate-300 leading-relaxed">
                      I confirm that the above information is accurate and complete
                    </label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="agreeContact"
                      className="w-5 h-5 rounded border-2 border-slate-400 bg-slate-700 text-[#6AAEFF] focus:ring-[#6AAEFF] focus:ring-2 mt-1"
                      checked={formData.agreeContact}
                      onChange={(e) => setFormData(prev => ({...prev, agreeContact: e.target.checked}))}
                    />
                    <label htmlFor="agreeContact" className="text-slate-300 leading-relaxed">
                      I agree to be contacted by Maashura for verification and follow-up
                    </label>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  className="w-full mt-8 px-8 py-4 bg-[#6AAEFF] text-white rounded-xl font-semibold text-lg hover:bg-white hover:text-[#6AAEFF] transition-all duration-300 shadow-xl hover:shadow-[#6AAEFF]/30 border border-transparent hover:border-[#6AAEFF] disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!formData.confirmAccuracy || !formData.agreeContact || !selectedRenewalPlan || isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    "✅ Submit Application"
                  )}
                </motion.button>
              </div>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </section>
    </>
  );
};

export default SupplierRegistration;
