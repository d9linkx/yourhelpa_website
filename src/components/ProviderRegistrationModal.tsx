import { useState } from 'react';
import { motion } from 'motion/react';
import { Store, Building2, User, Wallet, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { projectId } from '../utils/supabase/info';

interface ProviderRegistrationModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProviderRegistrationModal({ open, onClose, onSuccess }: ProviderRegistrationModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    businessName: '',
    accountType: 'individual',
    bio: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };



  const validateStep = () => {
    if (step === 1) {
      if (!formData.businessName.trim()) {
        setError('Business name is required');
        return false;
      }
    }
    if (step === 2) {
      if (!formData.bio.trim()) {
        setError('Bio is required');
        return false;
      }
      if (formData.bio.length < 50) {
        setError('Bio must be at least 50 characters');
        return false;
      }
    }
    if (step === 3) {
      if (!formData.bankName.trim() || !formData.accountNumber.trim() || !formData.accountName.trim()) {
        setError('All bank details are required');
        return false;
      }
      if (!/^\d{10}$/.test(formData.accountNumber)) {
        setError('Account number must be 10 digits');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (step < 3) {
        setStep(step + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Please sign in first');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-bb3bbc22/provider/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            businessName: formData.businessName,
            accountType: formData.accountType,
            bio: formData.bio,
            bankDetails: {
              bankName: formData.bankName,
              accountNumber: formData.accountNumber,
              accountName: formData.accountName,
            },
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
        return;
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Registration error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const progressPercentage = (step / 3) * 100;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Store className="w-6 h-6 text-primary" />
            Become a Service Provider
          </DialogTitle>
          <DialogDescription>
            Join YourHelpa and start earning by offering your services
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Step {step} of 3</span>
            <span className="text-sm text-gray-600">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3 mb-4"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Step Content */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="businessName" className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" />
                  Business Name *
                </Label>
                <Input
                  id="businessName"
                  placeholder="e.g., John's Repair Services"
                  value={formData.businessName}
                  onChange={(e) => handleChange('businessName', e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  This is how customers will see your business
                </p>
              </div>



              <div className="space-y-2">
                <Label htmlFor="accountType" className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Account Type *
                </Label>
                <Select
                  value={formData.accountType}
                  onValueChange={(value) => handleChange('accountType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="business">Registered Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="bio">
                  Tell us about your business *
                </Label>
                <Textarea
                  id="bio"
                  placeholder="Describe your services, experience, and what makes you unique..."
                  value={formData.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  rows={6}
                  className="resize-none"
                />
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Minimum 50 characters</span>
                  <span>{formData.bio.length} / 500</span>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> A good bio includes:
                </p>
                <ul className="text-sm text-blue-700 mt-2 ml-4 list-disc space-y-1">
                  <li>Your experience and expertise</li>
                  <li>Types of services you offer</li>
                  <li>Your service area</li>
                  <li>What makes you different</li>
                </ul>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 mb-6">
                <div className="flex gap-3">
                  <Wallet className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-amber-800 mb-2">
                      <strong>Bank Account Information</strong>
                    </p>
                    <p className="text-sm text-amber-700">
                      Your earnings will be paid directly to this account. Payments are typically processed within 24-48 hours after job completion.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name *</Label>
                <Select
                  value={formData.bankName}
                  onValueChange={(value) => handleChange('bankName', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your bank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="access">Access Bank</SelectItem>
                    <SelectItem value="gtb">GTBank</SelectItem>
                    <SelectItem value="firstbank">First Bank</SelectItem>
                    <SelectItem value="zenith">Zenith Bank</SelectItem>
                    <SelectItem value="uba">UBA</SelectItem>
                    <SelectItem value="union">Union Bank</SelectItem>
                    <SelectItem value="fidelity">Fidelity Bank</SelectItem>
                    <SelectItem value="stanbic">Stanbic IBTC</SelectItem>
                    <SelectItem value="sterling">Sterling Bank</SelectItem>
                    <SelectItem value="wema">Wema Bank</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number *</Label>
                <Input
                  id="accountNumber"
                  type="text"
                  placeholder="0123456789"
                  maxLength={10}
                  value={formData.accountNumber}
                  onChange={(e) => handleChange('accountNumber', e.target.value.replace(/\D/g, ''))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountName">Account Name *</Label>
                <Input
                  id="accountName"
                  type="text"
                  placeholder="Full name as it appears on your account"
                  value={formData.accountName}
                  onChange={(e) => handleChange('accountName', e.target.value)}
                />
              </div>
            </>
          )}
        </motion.div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              disabled={loading}
              className="flex-1"
            >
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={loading}
            className="flex-1"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : step === 3 ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Complete Registration
              </>
            ) : (
              'Continue'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
