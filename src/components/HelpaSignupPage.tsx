import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, User, Mail, Phone, MapPin, Briefcase, Star, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { useAuth } from "./hooks/useAuth";
import { supabase } from "../supabaseClient";

interface HelpaSignupPageProps {
  onNavigate: (page: string, data?: string) => void;
  onBack: () => void;
}

export function HelpaSignupPage({ onNavigate, onBack }: HelpaSignupPageProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    services: [] as string[],
    experience: "",
    bio: "",
    termsAccepted: false,
    marketingConsent: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { signUp } = useAuth();

  const serviceOptions = [
    "Home Repairs",
    "Electrical Services",
    "Plumbing",
    "Cleaning",
    "Tutoring",
    "Health Care",
    "Food Services",
    "Transportation",
    "Event Planning",
    "Pet Care",
    "Gardening",
    "Tech Support",
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (formData.services.length === 0) newErrors.services = "Please select at least one service";
    if (!formData.experience) newErrors.experience = "Experience level is required";
    if (!formData.bio.trim()) newErrors.bio = "Bio is required";
    if (!formData.termsAccepted) newErrors.termsAccepted = "You must accept the terms and conditions";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: `${formData.firstName.toLowerCase()}${formData.lastName.toLowerCase()}123!`, // Temporary password
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            user_type: 'helpa',
          }
        }
      });

      if (authError) throw authError;

      // Save additional profile data
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            location: formData.location,
            services_offered: formData.services,
            experience_level: formData.experience,
            bio: formData.bio,
            user_type: 'helpa',
            is_verified: false,
            rating: 0,
            total_reviews: 0,
          });

        if (profileError) throw profileError;
      }

      // Navigate to email verification
      onNavigate('verify-email', formData.email);

    } catch (error: any) {
      console.error('Signup error:', error);
      setErrors({ submit: error.message || 'Failed to create account. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-primary/5 via-background to-emerald-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="w-16 h-16 bg-gradient-to-br from-primary to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-2">
            Become a Helpa
          </h1>
          <p className="text-muted-foreground">
            Join our network of trusted service providers
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl border border-border/50 p-8"
        >
          {/* Personal Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={errors.firstName ? 'border-red-500' : ''}
                  placeholder="Enter your first name"
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={errors.lastName ? 'border-red-500' : ''}
                  placeholder="Enter your last name"
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div className="mt-6">
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="your.email@example.com"
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="mt-6">
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                  placeholder="+234 xxx xxx xxxx"
                />
              </div>
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div className="mt-6">
              <Label htmlFor="location">Location *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className={`pl-10 ${errors.location ? 'border-red-500' : ''}`}
                  placeholder="City, State"
                />
              </div>
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>
          </div>

          {/* Services */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              Services You Offer *
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {serviceOptions.map((service) => (
                <div
                  key={service}
                  onClick={() => handleServiceToggle(service)}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.services.includes(service)
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={formData.services.includes(service)}
                      onChange={() => {}}
                      className="pointer-events-none"
                    />
                    <span className="text-sm">{service}</span>
                  </div>
                </div>
              ))}
            </div>
            {errors.services && <p className="text-red-500 text-sm mt-2">{errors.services}</p>}
          </div>

          {/* Experience */}
          <div className="mb-8">
            <Label htmlFor="experience">Experience Level *</Label>
            <Select value={formData.experience} onValueChange={(value) => handleInputChange('experience', value)}>
              <SelectTrigger className={errors.experience ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select your experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner (0-2 years)</SelectItem>
                <SelectItem value="intermediate">Intermediate (2-5 years)</SelectItem>
                <SelectItem value="experienced">Experienced (5-10 years)</SelectItem>
                <SelectItem value="expert">Expert (10+ years)</SelectItem>
              </SelectContent>
            </Select>
            {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
          </div>

          {/* Bio */}
          <div className="mb-8">
            <Label htmlFor="bio">Tell us about yourself *</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              className={`min-h-[100px] ${errors.bio ? 'border-red-500' : ''}`}
              placeholder="Describe your skills, experience, and what makes you a great service provider..."
            />
            {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
          </div>

          {/* Terms and Consent */}
          <div className="mb-8 space-y-4">
            <div className="flex items-start gap-3">
              <Checkbox
                id="terms"
                checked={formData.termsAccepted}
                onCheckedChange={(checked: boolean) => handleInputChange('termsAccepted', checked)}
              />
              <div>
                <Label htmlFor="terms" className="text-sm cursor-pointer">
                  I accept the Terms and Conditions and Privacy Policy *
                </Label>
                {errors.termsAccepted && <p className="text-red-500 text-sm mt-1">{errors.termsAccepted}</p>}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="marketing"
                checked={formData.marketingConsent}
                onCheckedChange={(checked: boolean) => handleInputChange('marketingConsent', checked)}
              />
              <Label htmlFor="marketing" className="text-sm cursor-pointer">
                I agree to receive marketing communications and updates
              </Label>
            </div>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating Account...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Create Helpa Account
              </div>
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => onNavigate('signin')}
              className="text-primary hover:underline"
            >
              Sign in here
            </button>
          </p>
        </motion.form>
      </div>
    </div>
  );
}
