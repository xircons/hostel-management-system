import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  Clock, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Download, 
  Copy, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  CreditCard,
  Smartphone,
  Wifi,
  Lock,
  Star,
  Users,
  Award
} from 'lucide-react';

const PremiumPayment = ({ 
  amount = 0, 
  bookingId = 'BK001', 
  onPaymentComplete, 
  onSaveQR,
  onBack,
  onNext 
}) => {
  // State management
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes
  const [paymentState, setPaymentState] = useState('awaiting'); // awaiting, processing, success, error, expired
  const [qrCodeDataURL, setQrCodeDataURL] = useState('');
  const [isHelpExpanded, setIsHelpExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [canExtendTime, setCanExtendTime] = useState(true);
  
  const canvasRef = useRef(null);
  const timerRef = useRef(null);

  // Timer effect with cleanup
  useEffect(() => {
    if (paymentState === 'awaiting' && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setPaymentState('expired');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [paymentState, timeRemaining]);

  // Generate QR code
  useEffect(() => {
    if (paymentState === 'awaiting') {
      generateQRCode();
    }
  }, [amount, bookingId, paymentState]);

  const generateQRCode = async () => {
    try {
      const qrString = `00020101021229370016A0000006770101110113006681234567890254040005303764540500${amount.toFixed(2)}5802TH6304`;
      
      const qrDataURL = await QRCode.toDataURL(qrString, {
        width: 300,
        margin: 2,
        color: { dark: '#1E40AF', light: '#FFFFFF' },
        errorCorrectionLevel: 'M'
      });

      setQrCodeDataURL(qrDataURL);

      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        const qrImage = new Image();
        qrImage.onload = () => {
          ctx.drawImage(qrImage, 0, 0, 300, 300);
          drawPromptPayLogo(ctx, 300, 300);
        };
        qrImage.src = qrDataURL;
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      setPaymentState('error');
    }
  };

  const drawPromptPayLogo = (ctx, width, height) => {
    const logoSize = 70;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Glassmorphism background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, logoSize / 2, 0, 2 * Math.PI);
    ctx.fill();
    
    // Border with gradient effect
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // PromptPay "P" logo
    ctx.fillStyle = '#1E40AF';
    ctx.font = 'bold 36px system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('P', centerX, centerY);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeRemaining > 300) return 'text-green-600'; // 5+ minutes
    if (timeRemaining > 60) return 'text-yellow-500';  // 1-5 minutes
    return 'text-red-500'; // < 1 minute
  };

  const getTimerBgColor = () => {
    if (timeRemaining > 300) return 'bg-green-50 border-green-200';
    if (timeRemaining > 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getProgressPercentage = () => {
    return ((600 - timeRemaining) / 600) * 100;
  };

  const handlePaymentComplete = () => {
    setPaymentState('processing');
    
    // Simulate processing
    setTimeout(() => {
      setPaymentState('success');
      setTimeout(() => {
        if (onPaymentComplete) {
          onPaymentComplete({
            bookingId,
            amount,
            paymentMethod: 'promptpay',
            timestamp: new Date().toISOString()
          });
        }
      }, 2000);
    }, 1500);
  };

  const handleSaveQR = async () => {
    setIsDownloading(true);
    
    try {
      if (canvasRef.current) {
        const link = document.createElement('a');
        link.download = `promptpay-qr-${bookingId}.png`;
        link.href = canvasRef.current.toDataURL();
        link.click();
        
        if (onSaveQR) {
          onSaveQR(qrCodeDataURL);
        }
      }
    } catch (error) {
      console.error('Error saving QR code:', error);
    } finally {
      setTimeout(() => setIsDownloading(false), 1000);
    }
  };

  const handleCopyReference = async () => {
    try {
      await navigator.clipboard.writeText(bookingId);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleExtendTime = () => {
    if (canExtendTime) {
      setTimeRemaining(prev => prev + 300); // Add 5 minutes
      setCanExtendTime(false);
    }
  };

  const getStatusIcon = () => {
    switch (paymentState) {
      case 'awaiting':
        return <Clock className="w-5 h-5 text-blue-600 animate-pulse" />;
      case 'processing':
        return <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600 animate-bounce" />;
      case 'error':
      case 'expired':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-blue-600" />;
    }
  };

  const getStatusMessage = () => {
    switch (paymentState) {
      case 'awaiting':
        return 'Awaiting Payment';
      case 'processing':
        return 'Verifying Payment...';
      case 'success':
        return 'Payment Successful!';
      case 'error':
        return 'Payment Error';
      case 'expired':
        return 'Payment Expired';
      default:
        return 'Awaiting Payment';
    }
  };

  const getStatusColor = () => {
    switch (paymentState) {
      case 'awaiting':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'processing':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
      case 'expired':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Secure Payment
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Complete your booking with our secure PromptPay payment system
          </p>
        </div>

        {/* Main Payment Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-8 mb-6">
          
          {/* Status Banner */}
          <div className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 mb-6 ${getStatusColor()}`}>
            {getStatusIcon()}
            <span className="font-semibold text-lg">{getStatusMessage()}</span>
          </div>

          {/* Amount Display */}
          <div className="text-center mb-8">
            <div className="text-5xl md:text-6xl font-bold text-gray-900 mb-2">
              ฿{amount.toLocaleString()}
            </div>
            <p className="text-gray-600 text-lg">Total Amount</p>
          </div>

          {/* Content Area */}
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            
            {/* QR Code Section */}
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                  <canvas 
                    ref={canvasRef}
                    width={300}
                    height={300}
                    className="rounded-2xl"
                  />
                </div>
                
                {/* Timer Overlay */}
                {paymentState === 'awaiting' && (
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className={`px-6 py-3 rounded-full border-2 ${getTimerBgColor()} backdrop-blur-sm`}>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className={`font-bold text-lg ${getTimerColor()}`}>
                          {formatTime(timeRemaining)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Transaction Details */}
            <div className="flex-1 space-y-6">
              
              {/* Progress Bar */}
              {paymentState === 'awaiting' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Payment Progress</span>
                    <span>{Math.round(getProgressPercentage())}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-1000 ${
                        timeRemaining > 300 ? 'bg-green-500' : 
                        timeRemaining > 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${getProgressPercentage()}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Transaction Details Card */}
              <div className="bg-gray-50/50 rounded-2xl p-6 space-y-4">
                <h3 className="font-semibold text-gray-900 mb-4">Transaction Details</h3>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Reference ID</span>
                  <div className="flex items-center gap-2">
                    <code className="bg-white px-3 py-1 rounded-lg text-sm font-mono">
                      {bookingId}
                    </code>
                    <button
                      onClick={handleCopyReference}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Payment Method</span>
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">PromptPay</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
                    {getStatusMessage()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {paymentState === 'awaiting' && (
                  <>
                    <button
                      onClick={handlePaymentComplete}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      I've Completed Payment
                    </button>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={handleSaveQR}
                        disabled={isDownloading}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        {isDownloading ? 'Saving...' : 'Save QR'}
                      </button>
                      
                      {timeRemaining < 120 && canExtendTime && (
                        <button
                          onClick={handleExtendTime}
                          className="flex-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-medium py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-lg"
                        >
                          Extend Time
                        </button>
                      )}
                    </div>
                  </>
                )}

                {paymentState === 'success' && (
                  <div className="text-center space-y-4">
                    <div className="text-green-600 text-lg font-semibold animate-bounce">
                      🎉 Payment Confirmed!
                    </div>
                    <p className="text-gray-600">
                      Your booking has been successfully confirmed. You will receive a confirmation email shortly.
                    </p>
                  </div>
                )}

                {paymentState === 'expired' && (
                  <div className="text-center space-y-4">
                    <div className="text-red-600 text-lg font-semibold">
                      ⏰ Payment Time Expired
                    </div>
                    <p className="text-gray-600">
                      The payment window has closed. Please start a new booking to try again.
                    </p>
                    <button
                      onClick={() => window.location.reload()}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                    >
                      Start New Booking
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => setIsHelpExpanded(!isHelpExpanded)}
              className="flex items-center justify-between w-full p-4 bg-gray-50/50 hover:bg-gray-100/50 rounded-xl transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">Payment Instructions</span>
              </div>
              {isHelpExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {isHelpExpanded && (
              <div className="mt-4 p-6 bg-white/50 rounded-2xl space-y-4 animate-fadeIn">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">How to Pay with PromptPay:</h4>
                  <ol className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-3">
                      <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">1</span>
                      Open your banking app (SCB, KBank, BBL, etc.)
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">2</span>
                      Select "Scan QR" or "PromptPay" option
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">3</span>
                      Scan the QR code displayed above
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">4</span>
                      Confirm the amount and complete payment
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">5</span>
                      Click "I've Completed Payment" button
                    </li>
                  </ol>
                </div>
                
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-blue-900">Secure Payment</h5>
                      <p className="text-blue-700 text-sm mt-1">
                        Your payment is processed securely through PromptPay. We never store your payment information.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Trust Badges Footer */}
        <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
          <div className="text-center mb-4">
            <h3 className="font-semibold text-gray-900 mb-2">Trusted & Secure</h3>
            <p className="text-gray-600 text-sm">Your payment is protected by industry-leading security</p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-6">
            <div className="flex items-center gap-2 text-gray-600">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Lock className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium">PCI Compliant</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Award className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium">Bank Certified</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium">24/7 Support</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        {(onBack || onNext) && (
          <div className="flex justify-between mt-8">
            {onBack && (
              <button
                onClick={onBack}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-300 hover:shadow-lg"
              >
                ← Back
              </button>
            )}
            {onNext && paymentState === 'success' && (
              <button
                onClick={onNext}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-all duration-300 hover:shadow-lg"
              >
                Continue →
              </button>
            )}
          </div>
        )}

        {/* Copy Success Feedback */}
        {isCopied && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce z-50">
            Reference copied to clipboard!
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PremiumPayment;
