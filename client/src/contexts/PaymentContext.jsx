import React, { createContext, useContext, useReducer } from 'react';

// Payment state reducer
const paymentReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PAYMENT_STATE':
      return {
        ...state,
        paymentState: action.payload
      };
    case 'SET_PAYMENT_DATA':
      return {
        ...state,
        paymentData: {
          ...state.paymentData,
          ...action.payload
        }
      };
    case 'SET_QR_DATA':
      return {
        ...state,
        qrDataURL: action.payload
      };
    case 'SET_IS_GENERATING':
      return {
        ...state,
        isGenerating: action.payload
      };
    case 'SET_IS_DOWNLOADING':
      return {
        ...state,
        isDownloading: action.payload
      };
    case 'SET_IS_COPIED':
      return {
        ...state,
        isCopied: action.payload
      };
    case 'RESET_PAYMENT':
      return initialState;
    default:
      return state;
  }
};

// Initial state
const initialState = {
  paymentState: 'awaiting', // awaiting, processing, success, expired
  paymentData: {
    amount: 0,
    reference: '',
    promptpayId: '0066812345678',
    timestamp: null
  },
  qrDataURL: '',
  isGenerating: false,
  isDownloading: false,
  isCopied: false
};

// Create context
const PaymentContext = createContext();

// Provider component
export const PaymentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(paymentReducer, initialState);

  const setPaymentState = (paymentState) => {
    dispatch({ type: 'SET_PAYMENT_STATE', payload: paymentState });
  };

  const setPaymentData = (paymentData) => {
    dispatch({ type: 'SET_PAYMENT_DATA', payload: paymentData });
  };

  const setQRData = (qrDataURL) => {
    dispatch({ type: 'SET_QR_DATA', payload: qrDataURL });
  };

  const setIsGenerating = (isGenerating) => {
    dispatch({ type: 'SET_IS_GENERATING', payload: isGenerating });
  };

  const setIsDownloading = (isDownloading) => {
    dispatch({ type: 'SET_IS_DOWNLOADING', payload: isDownloading });
  };

  const setIsCopied = (isCopied) => {
    dispatch({ type: 'SET_IS_COPIED', payload: isCopied });
  };

  const resetPayment = () => {
    dispatch({ type: 'RESET_PAYMENT' });
  };

  const value = {
    ...state,
    setPaymentState,
    setPaymentData,
    setQRData,
    setIsGenerating,
    setIsDownloading,
    setIsCopied,
    resetPayment
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};

// Custom hook to use payment context
export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

export default PaymentContext;
