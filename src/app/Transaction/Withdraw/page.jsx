"use client"

import CoinsDisplay from "@/Components/Coins/CoinsDisplay";
import { useState } from "react";

const errors = {
    'Invalid phone number': 'رقم الموبايل غير صحيح',
    'Insufficient coins': 'لا يوجد رصيد كافي',
};

function Page() {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState(null);  // Error state
  const [successMessage, setSuccessMessage] = useState(null);  // Success state
  const [loading, setLoading] = useState(false);  // Loading state
  
  async function sendWithdrawalRequest() {
    // Clear any previous messages before making a new request
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const response = await fetch('/api/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: phone, amount: parseFloat(amount) }), // Ensure amount is a number
      });

      const data = await response.json();
      console.log('Response from server:', data);

      if (data['transaction']?.success) {
        setSuccessMessage("طلب السحب قيد التنفيذ");
      } else {
        // Set error message based on response
        setError(errors[data.message] || 'حدث خطاء في الاتصال');
      }
    } catch (error) {
      // Display error if fetch fails
      setError(error.message || 'حدث خطأ في الاتصال');
      console.error('Error:', error);
    }
    setLoading(false);
  }

  return (
    <div>
      <div className="p-3">
        <div className="w-100 d-flex flex-column gap-3">
          <input
            className="input-2 w-100"
            type="text"
            placeholder="رقم محفظة فودافون كاش"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            className="input-2 w-100"
            type="number"
            placeholder="الكمية"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <button
          className="gradient-btn mt-3 w-100 border-0 px-4"
          style={{ borderRadius: '10px', height: '50px' }}
          onClick={sendWithdrawalRequest}
        >
          سحب
        </button>

        {loading && (
          <div className="alert alert-info mt-3">
            <strong>جاري التنفيذ...</strong>
          </div>
        )}
        
        {error && (
          <div className="alert alert-danger mt-3">
            <strong>خطأ:</strong> {error}
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success mt-3">
            <strong>نجاح:</strong> {successMessage}
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
