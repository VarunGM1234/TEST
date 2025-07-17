import React, { useState } from 'react';
import { Phone, ArrowRight, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

interface AuthScreenProps {
  onAuth: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuth }) => {
  const [step, setStep] = useState<'phone' | 'verify'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Mock OTP service - Replace with your actual OTP service
  const sendOTP = async (phone: string): Promise<{ success: boolean; message: string }> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock success/failure (you can modify this for testing)
    if (phone.length >= 10) {
      return { success: true, message: 'OTP sent successfully' };
    } else {
      return { success: false, message: 'Invalid phone number' };
    }
  };

  // Mock OTP verification - Replace with your actual verification service
  const verifyOTP = async (phone: string, otp: string): Promise<{ success: boolean; message: string }> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock verification (for testing, accept any 6-digit code)
    if (otp.length === 6) {
      return { success: true, message: 'OTP verified successfully' };
    } else {
      return { success: false, message: 'Invalid OTP' };
    }
  };

  const handlePhoneSubmit = async () => {
    setError('');
    
    // Validate phone number
    if (phoneNumber.length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    // Remove any non-digit characters
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await sendOTP(cleanPhone);
      
      if (result.success) {
        setOtpSent(true);
        setStep('verify');
        setError('');
      } else {
        setError(result.message || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSubmit = async () => {
    setError('');
    
    const otpString = verificationCode.join('');
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setIsLoading(true);

    try {
      const result = await verifyOTP(phoneNumber, otpString);
      
      if (result.success) {
        onAuth();
      } else {
        setError(result.message || 'Invalid OTP. Please try again.');
        // Clear the OTP fields on failure
        setVerificationCode(['', '', '', '', '', '']);
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace to move to previous input
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setIsLoading(true);
    setVerificationCode(['', '', '', '', '', '']);

    try {
      const result = await sendOTP(phoneNumber.replace(/\D/g, ''));
      
      if (result.success) {
        setError('');
        // You might want to show a success message here
      } else {
        setError(result.message || 'Failed to resend OTP. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'phone') {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-12">
          <div className="w-8 h-8 border-2 border-white rounded-full flex items-center justify-center">
            <div className="w-3 h-4 bg-white transform rotate-12"></div>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Enter Your Phone Number</h1>
        <p className="text-gray-400 text-center mb-8">
          We'll send you a verification code to confirm your identity.
        </p>
        
        <div className="w-full max-w-sm">
          <label className="block text-gray-400 text-sm mb-2">Enter Your Mobile number</label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="9874563210"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-green-500"
              disabled={isLoading}
            />
          </div>
          
          {error && (
            <div className="mt-2 flex items-center text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}
        </div>
        
        <button
          onClick={handlePhoneSubmit}
          disabled={isLoading || phoneNumber.length < 10}
          className="w-full max-w-sm mt-8 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center transition-colors"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 w-5 h-5 animate-spin" />
              Sending OTP...
            </>
          ) : (
            <>
              Send OTP
              <ArrowRight className="ml-2 w-5 h-5" />
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <button
        onClick={() => setStep('phone')}
        disabled={isLoading}
        className="absolute top-6 left-6 p-2 hover:bg-gray-800 disabled:cursor-not-allowed rounded-lg transition-colors"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>
      
      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-12">
        <div className="w-8 h-8 border-2 border-white rounded-full flex items-center justify-center">
          <div className="w-3 h-4 bg-white transform rotate-12"></div>
        </div>
      </div>
      
      <h1 className="text-2xl font-bold mb-2">Enter Verification Code</h1>
      <p className="text-gray-400 text-center mb-8">
        A 6-digit code has been sent to<br />
        +91 {phoneNumber.slice(0, 5)}XXXXX.
      </p>
      
      <div className="flex space-x-3 mb-6">
        {verificationCode.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            value={digit}
            onChange={(e) => handleCodeChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            maxLength={1}
            disabled={isLoading}
            className="w-12 h-12 bg-gray-800 border border-gray-700 rounded-lg text-center text-white focus:outline-none focus:border-green-500 disabled:cursor-not-allowed"
          />
        ))}
      </div>
      
      {error && (
        <div className="mb-4 flex items-center text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 mr-2" />
          {error}
        </div>
      )}
      
      <button 
        onClick={handleResendOTP}
        disabled={isLoading}
        className="text-gray-400 hover:text-white disabled:cursor-not-allowed transition-colors mb-8"
      >
        {isLoading ? 'Resending...' : "Didn't Receive An OTP? Resend OTP"}
      </button>
      
      <button
        onClick={handleVerificationSubmit}
        disabled={isLoading || verificationCode.some(digit => digit === '')}
        className="w-full max-w-sm bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center transition-colors"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 w-5 h-5 animate-spin" />
            Verifying...
          </>
        ) : (
          <>
            Verify & Continue
            <ArrowRight className="ml-2 w-5 h-5" />
          </>
        )}
      </button>
    </div>
  );
};

export default AuthScreen;