import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  Clock, 
  Shield, 
  CheckCircle, 
  Download, 
  Copy, 
  ChevronDown, 
  ChevronUp,
  AlertCircle,
  Loader2
} from 'lucide-react';

const PremiumPromptPay = ({ 
  amount = 0, 
  bookingId = 'BK001', 
  onPaymentComplete, 
  onSaveQR,
  onBack,
  onNext 
}) => {
  // State management
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes
  const [paymentState, setPaymentState] = useState('awaiting'); // awaiting, processing, success, error
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
        width: 240,
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
          ctx.drawImage(qrImage, 0, 0, 240, 240);
          drawPromptPayLogo(ctx, 240, 240);
        };
        qrImage.src = qrDataURL;
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      setPaymentState('error');
    }
  };

  const drawPromptPayLogo = (ctx, width, height) => {
    const logoSize = 50;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Glassmorphism background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, logoSize / 2, 0, 2 * Math.PI);
    ctx.fill();
    
    // Border with gradient effect
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // PromptPay "P" logo
    ctx.fillStyle = '#1E40AF';
    ctx.font = 'bold 28px system-ui';
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
    if (timeRemaining > 120) return 'text-yellow-600';  // 2-5 minutes
    return 'text-red-500'; // < 2 minutes
  };

  const getTimerBgColor = () => {
    if (timeRemaining > 300) return 'bg-green-50 border-green-200';
    if (timeRemaining > 120) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200 animate-pulse';
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

  const handleCopyID = async () => {
    try {
      await navigator.clipboard.writeText('0066812345678');
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
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
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
        return 'bg-blue-600';
      case 'processing':
        return 'bg-blue-600';
      case 'success':
        return 'bg-green-600';
      case 'error':
      case 'expired':
        return 'bg-red-500';
      default:
        return 'bg-blue-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-lg mx-auto">
        
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Complete Payment</h1>
        </div>

        {/* Main Payment Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          
          {/* Status Banner */}
          <div className={`${getStatusColor()} px-8 py-4 flex items-center justify-center gap-3`}>
            {getStatusIcon()}
            <span className="text-white font-semibold text-lg">{getStatusMessage()}</span>
          </div>

          {/* Progress Bar */}
          {paymentState === 'awaiting' && (
            <div className="px-8 py-2 bg-gray-50">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-1000 ${
                    timeRemaining > 300 ? 'bg-green-500' : 
                    timeRemaining > 120 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
            </div>
          )}

          {/* Amount Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-8 text-center">
            <p className="text-blue-100 text-sm opacity-90 mb-2">Total Amount</p>
            <div className="text-5xl font-bold text-white mb-1">
              ฿{amount.toLocaleString()}
            </div>
            <p className="text-blue-100 text-sm opacity-80">THB (Thai Baht)</p>
          </div>

          {/* QR Code Area */}
          <div className="px-8 py-8">
            <div className="relative">
              {/* Timer Floating Badge */}
              {paymentState === 'awaiting' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className={`px-4 py-2 rounded-full border-2 ${getTimerBgColor()} backdrop-blur-sm shadow-lg`}>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className={`font-mono text-xl font-bold ${getTimerColor()}`}>
                        {formatTime(timeRemaining)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* QR Code Card */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-xl shadow-lg">
                    <canvas 
                      ref={canvasRef}
                      width={240}
                      height={240}
                      className="rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons Below QR */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveQR}
                  disabled={isDownloading}
                  className="flex-1 bg-white border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  {isDownloading ? 'Saving...' : 'Download'}
                </button>
                
                <button
                  onClick={handleCopyID}
                  className="flex-1 bg-white border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy ID
                </button>
              </div>
            </div>
          </div>

          {/* Transaction Details Card */}
          <div className="px-8 pb-6">
            <div className="bg-gray-50 rounded-xl p-4 space-y-4">
              
              {/* PromptPay ID */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">PromptPay ID</span>
                <span className="font-mono font-semibold text-gray-800">0066812345678</span>
              </div>

              {/* Transaction Ref */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Transaction Ref</span>
                <span className="font-mono font-semibold text-gray-800">{bookingId}</span>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200"></div>

              {/* Secure Payment */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">Secure Payment</span>
                </div>
                <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-full">
                  VERIFIED
                </span>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="px-8 pb-6">
            <button
              onClick={() => setIsHelpExpanded(!isHelpExpanded)}
              className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold py-4 px-4 rounded-xl transition-all duration-300 flex items-center justify-between"
            >
              <span>How to pay with PromptPay?</span>
              {isHelpExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>

            {isHelpExpanded && (
              <div className="mt-4 bg-blue-50 rounded-xl p-6 space-y-4 animate-fadeIn">
                
                {/* Step 1 */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Open your banking app</div>
                    <div className="text-gray-600 text-sm">SCB Easy, K PLUS, KMA, or any PromptPay app</div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Scan QR code</div>
                    <div className="text-gray-600 text-sm">Use the scan function in your app</div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Confirm payment</div>
                    <div className="text-gray-600 text-sm">Check amount and authorize transaction</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Primary Action Button */}
          <div className="px-8 pb-8">
            {paymentState === 'awaiting' && (
              <>
                <button
                  onClick={handlePaymentComplete}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px] hover:scale-105"
                >
                  I've Completed Payment
                </button>
                
                {timeRemaining < 60 && canExtendTime && (
                  <button
                    onClick={handleExtendTime}
                    className="w-full mt-3 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                  >
                    Extend Time (+5 minutes)
                  </button>
                )}
              </>
            )}

            {paymentState === 'processing' && (
              <div className="w-full bg-blue-100 text-blue-800 font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin" />
                Verifying Payment...
              </div>
            )}

            {paymentState === 'success' && (
              <div className="text-center space-y-4">
                <div className="text-green-600 text-xl font-bold animate-bounce">
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

        {/* Trust Badges Footer */}
        <div className="mt-6 flex justify-center gap-6">
          <div className="flex items-center gap-2 text-gray-600">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium">Secure Payment</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium">No Hidden Fees</span>
          </div>
        </div>

        {/* Navigation */}
        {(onBack || onNext) && (
          <div className="flex justify-between mt-8">
            {onBack && (
              <button
                onClick={onBack}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-300 hover:shadow-lg"
              >
                ← Back
              </button>
            )}
            {onNext && paymentState === 'success' && (
              <button
                onClick={onNext}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg"
              >
                Continue →
              </button>
            )}
          </div>
        )}

        {/* Copy Success Feedback */}
        {isCopied && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce z-50 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Copied!
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

export default PremiumPromptPay;
