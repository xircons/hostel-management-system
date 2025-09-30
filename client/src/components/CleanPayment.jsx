import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Shield, ChevronUp, ChevronDown } from 'lucide-react';

const CleanPayment = ({ 
  amount = 0, 
  bookingId = 'BK001', 
  onPaymentComplete, 
  onSaveQR,
  onBack,
  onNext 
}) => {
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes
  const [qrCodeDataURL, setQrCodeDataURL] = useState('');
  const [isInstructionsExpanded, setIsInstructionsExpanded] = useState(true);
  const canvasRef = useRef(null);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Generate QR code
  useEffect(() => {
    generateQRCode();
  }, [amount, bookingId]);

  const generateQRCode = async () => {
    try {
      const qrString = `00020101021229370016A0000006770101110113006681234567890254040005303764540500${amount.toFixed(2)}5802TH6304`;
      
      const qrDataURL = await QRCode.toDataURL(qrString, {
        width: 200,
        margin: 2,
        color: { dark: '#000000', light: '#FFFFFF' },
        errorCorrectionLevel: 'M'
      });

      setQrCodeDataURL(qrDataURL);

      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        const qrImage = new Image();
        qrImage.onload = () => {
          ctx.drawImage(qrImage, 0, 0, 200, 200);
          drawPromptPayLogo(ctx, 200, 200);
        };
        qrImage.src = qrDataURL;
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const drawPromptPayLogo = (ctx, width, height) => {
    const logoSize = 40;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // White background circle
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(centerX, centerY, logoSize / 2, 0, 2 * Math.PI);
    ctx.fill();
    
    // Blue border
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // PromptPay "P" logo
    ctx.fillStyle = '#1a1a1a';
    ctx.font = 'bold 24px system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('P', centerX, centerY);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePaymentComplete = () => {
    if (onPaymentComplete) {
      onPaymentComplete({
        bookingId,
        amount,
        paymentMethod: 'promptpay',
        timestamp: new Date().toISOString()
      });
    }
  };

  const handleSaveQR = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `promptpay-qr-${bookingId}.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
      
      if (onSaveQR) {
        onSaveQR(qrCodeDataURL);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment</h1>
          <p className="text-gray-600">Complete your booking with PromptPay</p>
        </div>

        {/* Transaction Summary Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="space-y-4">
            
            {/* PromptPay ID */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">PromptPay ID</span>
              <span className="font-semibold text-gray-900">0066812345678</span>
            </div>

            {/* Transaction Ref */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Transaction Ref</span>
              <span className="font-semibold text-gray-900">{bookingId}</span>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Secure Payment */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-gray-600 text-sm">Secure Payment</span>
              </div>
              <span className="text-green-600 font-semibold text-sm">VERIFIED</span>
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Scan QR Code</h3>
            
            <div className="flex justify-center mb-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <canvas 
                  ref={canvasRef}
                  width={200}
                  height={200}
                  className="rounded"
                />
              </div>
            </div>

            {/* Timer */}
            <div className="mb-4">
              <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
                <span className="text-yellow-600 text-sm font-medium">
                  Time remaining: {formatTime(timeRemaining)}
                </span>
              </div>
            </div>

            {/* Amount */}
            <div className="text-3xl font-bold text-gray-900 mb-4">
              ฿{amount.toLocaleString()}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handlePaymentComplete}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                I've Completed Payment
              </button>
              
              <button
                onClick={handleSaveQR}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Save QR Code
              </button>
            </div>
          </div>
        </div>

        {/* Instructions Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          
          {/* Instructions Header */}
          <button
            onClick={() => setIsInstructionsExpanded(!isInstructionsExpanded)}
            className="w-full bg-blue-50 hover:bg-blue-100 px-4 py-3 flex items-center justify-between transition-colors"
          >
            <span className="font-semibold text-blue-900">How to pay with PromptPay?</span>
            {isInstructionsExpanded ? (
              <ChevronUp className="w-5 h-5 text-blue-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-blue-600" />
            )}
          </button>

          {/* Instructions Content */}
          {isInstructionsExpanded && (
            <div className="p-4 space-y-4">
              
              {/* Step 1 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Open your banking app</div>
                  <div className="text-gray-600 text-sm">SCB Easy, K PLUS, KMA, or any PromptPay app</div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Scan QR code</div>
                  <div className="text-gray-600 text-sm">Use the scan function in your app</div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
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

        {/* Navigation */}
        {(onBack || onNext) && (
          <div className="flex justify-between mt-6">
            {onBack && (
              <button
                onClick={onBack}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                ← Back
              </button>
            )}
            {onNext && (
              <button
                onClick={onNext}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
              >
                Continue →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CleanPayment;
