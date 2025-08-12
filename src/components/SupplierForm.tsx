import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building, FileText, CheckCircle, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAllCategories } from '@/hooks/useAdminCategories';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';
import { useToast } from '@/components/ui/use-toast';

const SupplierForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Get admin-managed categories
  const { 
    countries, 
    emirates, 
    businessTypes: adminBusinessTypes,
    loading: categoriesLoading 
  } = useAllCategories();

  const [formData, setFormData] = useState({
    // Company Information
    companyName: '',
    businessRegistration: '',
    taxId: '',
    yearEstablished: '',
    employeeCount: '',
    country: '',
    emirate: '',
    yearsOfOperation: '',
    
    // Contact Information
    contactName: '',
    position: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    
    // Business Details
    businessType: '',
    products: '',
    experience: '',
    certifications: '',
    references: '',
    
    // Additional Information
    capacity: '',
    qualityStandards: '',
    additionalInfo: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Add supplier to Firebase
      const docRef = await addDoc(collection(db, 'suppliers'), {
        ...formData,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        id: crypto.randomUUID()
      });

      console.log('Supplier registered with ID: ', docRef.id);
      
      toast({
        title: "Application Submitted!",
        description: "Your supplier registration has been submitted successfully.",
      });
      
      setIsSubmitted(true);
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast({
        title: "Submission Failed",
        description: `Error: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Company Info", icon: Building },
    { number: 2, title: "Contact Details", icon: FileText },
    { number: 3, title: "Business Details", icon: Building },
    { number: 4, title: "Additional Info", icon: Upload }
  ];

  const employeeCounts = [
    "1-10",
    "11-50",
    "51-100",
    "101-500",
    "500+"
  ];

  return (
    <section id="supplier" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Supplier <span className="bg-gradient-primary bg-clip-text text-transparent">Registration</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join our network of trusted suppliers and partners. We're always looking 
            for quality vendors to expand our service offerings.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center py-12"
              >
                <Card className="border-0 bg-card/80 backdrop-blur-sm shadow-elegant">
                  <CardContent className="py-12">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="mx-auto mb-6 p-6 bg-green-500/20 rounded-full w-fit"
                    >
                      <CheckCircle className="text-green-500" size={64} />
                    </motion.div>
                    <h3 className="text-3xl font-bold text-foreground mb-4">
                      Registration Submitted Successfully!
                    </h3>
                    <p className="text-muted-foreground text-lg mb-6">
                      Thank you for your interest in becoming a supplier. Our team will review 
                      your application and contact you within 5-7 business days.
                    </p>
                    <Button
                      onClick={() => {
                        setIsSubmitted(false);
                        setCurrentStep(1);
                        setFormData({
                          companyName: '', businessRegistration: '', taxId: '', yearEstablished: '', employeeCount: '',
                          country: '', emirate: '', yearsOfOperation: '',
                          contactName: '', position: '', email: '', phone: '', website: '', address: '',
                          businessType: '', products: '', experience: '', certifications: '', references: '',
                          capacity: '', qualityStandards: '', additionalInfo: ''
                        });
                      }}
                      className="bg-gradient-primary text-primary-foreground px-8 py-3"
                    >
                      Submit Another Application
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Progress Steps */}
                <div className="mb-8">
                  <div className="flex justify-between items-center">
                    {steps.map((step, index) => (
                      <motion.div
                        key={step.number}
                        className="flex flex-col items-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                            currentStep >= step.number
                              ? 'bg-gradient-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          <step.icon size={20} />
                        </div>
                        <span className={`text-sm ${currentStep >= step.number ? 'text-primary' : 'text-muted-foreground'}`}>
                          {step.title}
                        </span>
                        {index < steps.length - 1 && (
                          <div
                            className={`hidden md:block absolute h-0.5 w-24 mt-6 ml-12 transition-all duration-300 ${
                              currentStep > step.number ? 'bg-primary' : 'bg-muted'
                            }`}
                          />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Form Content */}
                <Card className="border-0 bg-card/80 backdrop-blur-sm shadow-elegant">
                  <CardHeader>
                    <CardTitle className="text-2xl text-foreground">
                      Step {currentStep} of 4: {steps[currentStep - 1].title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={currentStep === 4 ? handleSubmit : (e) => e.preventDefault()}>
                      <AnimatePresence mode="wait">
                        {/* Step 1: Company Information */}
                        {currentStep === 1 && (
                          <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="space-y-6"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <Label htmlFor="companyName">Company Name *</Label>
                                <Input
                                  id="companyName"
                                  name="companyName"
                                  value={formData.companyName}
                                  onChange={handleInputChange}
                                  required
                                  className="mt-2"
                                />
                              </div>
                              <div>
                                <Label htmlFor="businessRegistration">Business Registration Number</Label>
                                <Input
                                  id="businessRegistration"
                                  name="businessRegistration"
                                  value={formData.businessRegistration}
                                  onChange={handleInputChange}
                                  className="mt-2"
                                />
                              </div>
                              <div>
                                <Label htmlFor="taxId">Tax ID</Label>
                                <Input
                                  id="taxId"
                                  name="taxId"
                                  value={formData.taxId}
                                  onChange={handleInputChange}
                                  className="mt-2"
                                />
                              </div>
                              <div>
                                <Label htmlFor="yearEstablished">Year Established</Label>
                                <Input
                                  id="yearEstablished"
                                  name="yearEstablished"
                                  type="number"
                                  value={formData.yearEstablished}
                                  onChange={handleInputChange}
                                  className="mt-2"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <Label htmlFor="employeeCount">Number of Employees</Label>
                                <select
                                  id="employeeCount"
                                  name="employeeCount"
                                  value={formData.employeeCount}
                                  onChange={handleInputChange}
                                  className="mt-2 w-full px-3 py-2 border border-input bg-background rounded-md"
                                >
                                  <option value="">Select range</option>
                                  {employeeCounts.map((count, index) => (
                                    <option key={index} value={count}>{count}</option>
                                  ))}
                                </select>
                              </div>
                              
                              {/* New dropdown fields */}
                              <div>
                                <Label htmlFor="country">Country *</Label>
                                <Select value={formData.country} onValueChange={(value) => handleSelectChange('country', value)}>
                                  <SelectTrigger className="mt-2">
                                    <SelectValue placeholder="Select country" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {categoriesLoading ? (
                                      <SelectItem value="loading" disabled>Loading countries...</SelectItem>
                                    ) : countries.items.length > 0 ? (
                                      countries.items.map((country) => (
                                        <SelectItem key={country.id} value={country.name}>
                                          {country.name}
                                        </SelectItem>
                                      ))
                                    ) : (
                                      <SelectItem value="uae" disabled>UAE (Default)</SelectItem>
                                    )}
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <Label htmlFor="emirate">Emirate *</Label>
                                <Select value={formData.emirate} onValueChange={(value) => handleSelectChange('emirate', value)}>
                                  <SelectTrigger className="mt-2">
                                    <SelectValue placeholder="Select emirate" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {categoriesLoading ? (
                                      <SelectItem value="loading" disabled>Loading emirates...</SelectItem>
                                    ) : emirates.items.length > 0 ? (
                                      emirates.items.map((emirate) => (
                                        <SelectItem key={emirate.id} value={emirate.name}>
                                          {emirate.name}
                                        </SelectItem>
                                      ))
                                    ) : (
                                      <>
                                        <SelectItem value="dubai">Dubai</SelectItem>
                                        <SelectItem value="abu-dhabi">Abu Dhabi</SelectItem>
                                        <SelectItem value="sharjah">Sharjah</SelectItem>
                                        <SelectItem value="ajman">Ajman</SelectItem>
                                        <SelectItem value="fujairah">Fujairah</SelectItem>
                                        <SelectItem value="ras-al-khaimah">Ras Al Khaimah</SelectItem>
                                        <SelectItem value="umm-al-quwain">Umm Al Quwain</SelectItem>
                                      </>
                                    )}
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <Label htmlFor="yearsOfOperation">Years of Operation</Label>
                                <Select value={formData.yearsOfOperation} onValueChange={(value) => handleSelectChange('yearsOfOperation', value)}>
                                  <SelectTrigger className="mt-2">
                                    <SelectValue placeholder="Select years of operation" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {categoriesLoading ? (
                                      <SelectItem value="loading" disabled>Loading options...</SelectItem>
                                    ) : (
                                      <>
                                        <SelectItem value="0-1">0-1 Years</SelectItem>
                                        <SelectItem value="2-5">2-5 Years</SelectItem>
                                        <SelectItem value="6-10">6-10 Years</SelectItem>
                                        <SelectItem value="11-20">11-20 Years</SelectItem>
                                        <SelectItem value="20+">20+ Years</SelectItem>
                                      </>
                                    )}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* Step 2: Contact Information */}
                        {currentStep === 2 && (
                          <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="space-y-6"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <Label htmlFor="contactName">Contact Person Name *</Label>
                                <Input
                                  id="contactName"
                                  name="contactName"
                                  value={formData.contactName}
                                  onChange={handleInputChange}
                                  required
                                  className="mt-2"
                                />
                              </div>
                              <div>
                                <Label htmlFor="position">Position/Title</Label>
                                <Input
                                  id="position"
                                  name="position"
                                  value={formData.position}
                                  onChange={handleInputChange}
                                  className="mt-2"
                                />
                              </div>
                              <div>
                                <Label htmlFor="email">Email Address *</Label>
                                <Input
                                  id="email"
                                  name="email"
                                  type="email"
                                  value={formData.email}
                                  onChange={handleInputChange}
                                  required
                                  className="mt-2"
                                />
                              </div>
                              <div>
                                <Label htmlFor="phone">Phone Number *</Label>
                                <Input
                                  id="phone"
                                  name="phone"
                                  type="tel"
                                  value={formData.phone}
                                  onChange={handleInputChange}
                                  required
                                  className="mt-2"
                                />
                              </div>
                              <div>
                                <Label htmlFor="website">Website</Label>
                                <Input
                                  id="website"
                                  name="website"
                                  type="url"
                                  value={formData.website}
                                  onChange={handleInputChange}
                                  className="mt-2"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <Label htmlFor="address">Business Address</Label>
                                <Textarea
                                  id="address"
                                  name="address"
                                  value={formData.address}
                                  onChange={handleInputChange}
                                  rows={3}
                                  className="mt-2"
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* Step 3: Business Details */}
                        {currentStep === 3 && (
                          <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="space-y-6"
                          >
                            <div>
                              <Label htmlFor="businessType">Business Type</Label>
                              <Select value={formData.businessType} onValueChange={(value) => handleSelectChange('businessType', value)}>
                                <SelectTrigger className="mt-2">
                                  <SelectValue placeholder="Select business type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {categoriesLoading ? (
                                    <SelectItem value="loading" disabled>Loading business types...</SelectItem>
                                  ) : adminBusinessTypes.items.length > 0 ? (
                                    adminBusinessTypes.items.map((type) => (
                                      <SelectItem key={type.id} value={type.name}>
                                        {type.name}
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <>
                                      <SelectItem value="manufacturer">Manufacturer</SelectItem>
                                      <SelectItem value="distributor">Distributor</SelectItem>
                                      <SelectItem value="reseller">Reseller</SelectItem>
                                      <SelectItem value="service-provider">Service Provider</SelectItem>
                                      <SelectItem value="consultant">Consultant</SelectItem>
                                      <SelectItem value="other">Other</SelectItem>
                                    </>
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="products">Products/Services Offered *</Label>
                              <Textarea
                                id="products"
                                name="products"
                                value={formData.products}
                                onChange={handleInputChange}
                                required
                                rows={4}
                                className="mt-2"
                                placeholder="Describe the products or services you offer..."
                              />
                            </div>
                            <div>
                              <Label htmlFor="experience">Years of Experience</Label>
                              <Input
                                id="experience"
                                name="experience"
                                value={formData.experience}
                                onChange={handleInputChange}
                                className="mt-2"
                                placeholder="e.g., 5 years"
                              />
                            </div>
                            <div>
                              <Label htmlFor="certifications">Certifications & Awards</Label>
                              <Textarea
                                id="certifications"
                                name="certifications"
                                value={formData.certifications}
                                onChange={handleInputChange}
                                rows={3}
                                className="mt-2"
                                placeholder="List any relevant certifications, awards, or recognitions..."
                              />
                            </div>
                          </motion.div>
                        )}

                        {/* Step 4: Additional Information */}
                        {currentStep === 4 && (
                          <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="space-y-6"
                          >
                            <div>
                              <Label htmlFor="capacity">Production/Service Capacity</Label>
                              <Textarea
                                id="capacity"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleInputChange}
                                rows={3}
                                className="mt-2"
                                placeholder="Describe your capacity to handle orders or projects..."
                              />
                            </div>
                            <div>
                              <Label htmlFor="qualityStandards">Quality Standards & Compliance</Label>
                              <Textarea
                                id="qualityStandards"
                                name="qualityStandards"
                                value={formData.qualityStandards}
                                onChange={handleInputChange}
                                rows={3}
                                className="mt-2"
                                placeholder="List quality standards you follow (ISO, etc.)..."
                              />
                            </div>
                            <div>
                              <Label htmlFor="references">References</Label>
                              <Textarea
                                id="references"
                                name="references"
                                value={formData.references}
                                onChange={handleInputChange}
                                rows={4}
                                className="mt-2"
                                placeholder="Provide references from previous clients or partners..."
                              />
                            </div>
                            <div>
                              <Label htmlFor="additionalInfo">Additional Information</Label>
                              <Textarea
                                id="additionalInfo"
                                name="additionalInfo"
                                value={formData.additionalInfo}
                                onChange={handleInputChange}
                                rows={4}
                                className="mt-2"
                                placeholder="Any additional information you'd like to share..."
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Navigation Buttons */}
                      <div className="flex justify-between mt-8">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handlePrevious}
                          disabled={currentStep === 1}
                          className="px-6"
                        >
                          Previous
                        </Button>
                        
                        {currentStep < 4 ? (
                          <Button
                            type="button"
                            onClick={handleNext}
                            className="bg-gradient-primary text-primary-foreground px-6"
                          >
                            Next
                          </Button>
                        ) : (
                          <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-gradient-primary text-primary-foreground px-6"
                          >
                            {isLoading ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                              />
                            ) : (
                              'Submit Application'
                            )}
                          </Button>
                        )}
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default SupplierForm;