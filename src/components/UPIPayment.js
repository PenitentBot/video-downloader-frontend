import React, { useState } from 'react';

function UPIPayment({ daysCount, price, currency, currencySymbol, onPaymentInitiated, onClose }) {
  const [transactionId, setTransactionId] = useState('');
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // Your UPI ID - Replace with your actual UPI
  const UPI_ID = 'yourname@googleplay'; // Change this to your UPI

  // Generate UPI link
  const generateUPILink = () => {
    const amount = Math.round(price);
    const upiLink = `upi://pay?pa=${UPI_ID}&pn=YouTube%20Downloader&am=${amount}&tn=Premium%20${daysCount}%20Days&tr=YTD${Date.now()}`;
    return upiLink;
  };

  const handleInitiatePayment = () => {
    const upiLink = generateUPILink();
    window.location.href = upiLink;
    setShowTransactionForm(true);
  };

  const handleSubmitTransaction = async (e) => {
    e.preventDefault();
    
    if (!transactionId.trim()) {
      setMessage('❌ Please enter transaction ID');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      // Send to backend for verification
      const response = await fetch('http://localhost:3000/api/verify-upi-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId: transactionId,
          amount: price,
          daysCount: daysCount,
          currency: currency,
          upiId: UPI_ID,
          timestamp: new Date().toISOString()
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage('✅ Payment received! Processing...');
        onPaymentInitiated({
          transactionId: transactionId,
          amount: price,
          daysCount: daysCount,
          currency: currency,
          status: 'pending_verification'
        });
        
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setMessage('⚠️ ' + (data.message || 'Verification pending'));
      }
    } catch (err) {
      setMessage('❌ Error: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <button style={styles.closeBtn} onClick={onClose}>✕</button>

        <h2 style={styles.title}>💳 Pay with UPI</h2>
        <p style={styles.desc}>Quick and secure payment via Google Pay</p>

        {!showTransactionForm ? (
          <>
            {/* Payment Amount */}
            <div style={styles.amountBox}>
              <span style={styles.label}>Amount to Pay:</span>
              <span style={styles.amount}>{currencySymbol}{price}</span>
              <span style={styles.duration}>For {daysCount} Days Premium</span>
            </div>

            {/* UPI Info */}
            <div style={styles.infoBox}>
              <p style={styles.infoTitle}>📱 Your UPI ID:</p>
              <div style={styles.upiDisplay}>
                <code style={styles.upiCode}>{UPI_ID}</code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(UPI_ID);
                    alert('UPI ID copied!');
                  }}
                  style={styles.copyBtn}
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Steps */}
            <div style={styles.steps}>
              <h3>Steps:</h3>
              <div style={styles.step}>
                <span style={styles.stepNum}>1</span>
                <span>Click "Open Google Pay" button below</span>
              </div>
              <div style={styles.step}>
                <span style={styles.stepNum}>2</span>
                <span>Enter amount: {currencySymbol}{price}</span>
              </div>
              <div style={styles.step}>
                <span style={styles.stepNum}>3</span>
                <span>Complete payment in Google Pay</span>
              </div>
              <div style={styles.step}>
                <span style={styles.stepNum}>4</span>
                <span>Copy Transaction ID from receipt</span>
              </div>
              <div style={styles.step}>
                <span style={styles.stepNum}>5</span>
                <span>Paste it below and click submit</span>
              </div>
            </div>

            {/* Open Google Pay Button */}
            <button
              onClick={handleInitiatePayment}
              style={styles.payBtn}
              onMouseEnter={(e) => e.target.style.background = '#1f2937'}
              onMouseLeave={(e) => e.target.style.background = '#111827'}
            >
              📱 Open Google Pay
            </button>

            {/* Manual Entry Info */}
            <p style={styles.manualInfo}>
              Or manually enter your UPI ID in Google Pay/PhonePe and send {currencySymbol}{price}
            </p>

            <button
              onClick={() => setShowTransactionForm(true)}
              style={styles.transactionBtn}
            >
              ✓ Already Paid? Enter Transaction ID
            </button>
          </>
        ) : (
          <>
            {/* Transaction ID Form */}
            <form onSubmit={handleSubmitTransaction} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Transaction ID</label>
                <input
                  type="text"
                  placeholder="e.g., TXN123456789"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  style={styles.input}
                  disabled={isSubmitting}
                />
                <p style={styles.hint}>Find it in your transaction receipt/details</p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{...styles.submitBtn, opacity: isSubmitting ? 0.6 : 1}}
              >
                {isSubmitting ? '⏳ Verifying...' : '✓ Submit Payment'}
              </button>

              <button
                type="button"
                onClick={() => setShowTransactionForm(false)}
                style={styles.backBtn}
              >
                ← Back
              </button>
            </form>
          </>
        )}

        {message && (
          <div style={{...styles.message, background: message.includes('❌') ? '#fee2e2' : '#d1fae5'}}>
            {message}
          </div>
        )}

        <p style={styles.footer}>
          ⏳ Your premium will activate after admin verification (usually within 1 hour)
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(5px)'
  },
  content: {
    background: 'white',
    borderRadius: '20px',
    padding: '40px',
    maxWidth: '500px',
    width: '95%',
    position: 'relative',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    animation: 'slideUp 0.3s ease'
  },
  closeBtn: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#666'
  },
  title: {
    fontSize: '24px',
    margin: '0 0 10px 0',
    color: '#333'
  },
  desc: {
    fontSize: '14px',
    color: '#666',
    margin: '0 0 30px 0'
  },
  amountBox: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '25px',
    borderRadius: '12px',
    textAlign: 'center',
    marginBottom: '25px'
  },
  label: {
    display: 'block',
    fontSize: '14px',
    opacity: 0.9,
    marginBottom: '10px'
  },
  amount: {
    display: 'block',
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '5px'
  },
  duration: {
    display: 'block',
    fontSize: '12px',
    opacity: 0.8
  },
  infoBox: {
    background: '#f3f4f6',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '25px'
  },
  infoTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 10px 0'
  },
  upiDisplay: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center'
  },
  upiCode: {
    flex: 1,
    background: 'white',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    color: '#667eea',
    fontWeight: 'bold'
  },
  copyBtn: {
    background: '#667eea',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '13px'
  },
  steps: {
    background: '#f9fafb',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '25px'
  },
  step: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    padding: '10px 0',
    fontSize: '14px',
    color: '#555'
  },
  stepNum: {
    background: '#667eea',
    color: 'white',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '12px'
  },
  payBtn: {
    width: '100%',
    padding: '16px',
    background: '#111827',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginBottom: '12px',
    transition: 'all 0.3s ease'
  },
  transactionBtn: {
    width: '100%',
    padding: '12px',
    background: '#f3f4f6',
    color: '#333',
    border: '2px solid #ddd',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  manualInfo: {
    fontSize: '12px',
    color: '#999',
    textAlign: 'center',
    margin: '15px 0'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  input: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.3s ease'
  },
  hint: {
    fontSize: '12px',
    color: '#999',
    margin: 0
  },
  submitBtn: {
    padding: '14px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  backBtn: {
    padding: '12px',
    background: '#f3f4f6',
    color: '#333',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    cursor: 'pointer'
  },
  message: {
    padding: '12px',
    borderRadius: '8px',
    marginTop: '15px',
    fontSize: '14px',
    fontWeight: '600',
    textAlign: 'center'
  },
  footer: {
    fontSize: '12px',
    color: '#999',
    textAlign: 'center',
    marginTop: '20px'
  }
};

export default UPIPayment;
