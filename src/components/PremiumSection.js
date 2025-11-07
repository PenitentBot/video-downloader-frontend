import React, { useState, useEffect } from 'react';

// Move OUTSIDE component - NO dependency warnings
const countryToCurrency = {
  'IN': 'INR',
  'US': 'USD',
  'GB': 'GBP',
  'CA': 'CAD',
  'AU': 'AUD',
  'DE': 'EUR',
  'FR': 'EUR',
  'IT': 'EUR',
  'ES': 'EUR',
  'NL': 'EUR',
  'JP': 'JPY',
  'AE': 'AED',
  'SG': 'SGD',
  'HK': 'HKD'
};

const currencyRates = {
  'USD': { symbol: '$', rate: 0.0024, price30: 199 },
  'INR': { symbol: '₹', rate: 1, price30: 199 },
  'EUR': { symbol: '€', rate: 0.0022, price30: 199 },
  'GBP': { symbol: '£', rate: 0.0019, price30: 199 },
  'AUD': { symbol: 'A$', rate: 0.0037, price30: 199 },
  'CAD': { symbol: 'C$', rate: 0.0033, price30: 199 },
  'JPY': { symbol: '¥', rate: 0.36, price30: 199 },
  'AED': { symbol: 'د.إ', rate: 0.0088, price30: 199 },
  'SGD': { symbol: 'S$', rate: 0.0032, price30: 199 },
  'HKD': { symbol: 'HK$', rate: 0.019, price30: 199 }
};

function PremiumSection({ isPremium, onUpgrade }) {
  const [premiumData, setPremiumData] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [daysCount, setDaysCount] = useState(30);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [currency, setCurrency] = useState('INR');

  useEffect(() => {
    // Detect user location and set currency
    const detectCurrency = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const countryCode = data.country_code;
        
        const detectedCurrency = countryToCurrency[countryCode] || 'INR';
        setCurrency(detectedCurrency);
      } catch (err) {
        console.log('Could not detect location, using INR');
        setCurrency('INR');
      }
    };

    detectCurrency();

    // Load premium data
    const stored = localStorage.getItem('premiumData');
    if (stored) {
      setPremiumData(JSON.parse(stored));
    }
  }, []);

  const pricingPlans = {
    30: 199,
    90: 499,
    180: 899,
    365: 1499
  };

  const getPrice = (days) => {
    const basePrice = pricingPlans[days] || 199;
    const currencyData = currencyRates[currency];
    
    if (!currencyData) return basePrice.toFixed(2);
    
    const convertedPrice = (basePrice * currencyData.rate).toFixed(2);
    return convertedPrice;
  };

  const calculatePrice = () => {
    return getPrice(daysCount);
  };

  const getPricingOptions = () => {
    return [
      { days: 30, label: '30 Days' },
      { days: 90, label: '90 Days' },
      { days: 180, label: '180 Days' },
      { days: 365, label: '1 Year' }
    ];
  };

  const getRemainingDays = () => {
    if (!premiumData) return null;
    const now = new Date();
    const expiry = new Date(premiumData.expiryDate);
    const diff = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setMessage('');

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const startDate = new Date();
      const expiryDate = new Date(startDate.getTime() + daysCount * 24 * 60 * 60 * 1000);

      const newPremiumData = {
        startDate: startDate.toISOString(),
        expiryDate: expiryDate.toISOString(),
        paymentMethod: paymentMethod,
        daysCount: daysCount,
        price: calculatePrice(),
        currency: currency,
        status: 'active'
      };

      localStorage.setItem('premiumData', JSON.stringify(newPremiumData));
      setPremiumData(newPremiumData);
      
      setMessage('✅ Premium activated successfully!');
      setShowPayment(false);
      onUpgrade();

      setTimeout(() => setMessage(''), 3000);

    } catch (err) {
      setMessage('❌ Payment failed. Try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const currencyData = currencyRates[currency];
  const currencySymbol = currencyData ? currencyData.symbol : '₹';

  if (isPremium && premiumData) {
    const remaining = getRemainingDays();
    const startDate = new Date(premiumData.startDate);
    const expiryDate = new Date(premiumData.expiryDate);

    return (
      <div style={styles.container}>
        <div style={styles.activePremium}>
          <div style={styles.currencyTag}>
            Currency: {currency} ({currencySymbol})
          </div>
          
          <h3 style={styles.title}>👑 Premium Active</h3>
          
          <div style={styles.infoGrid}>
            <div style={styles.infoBox}>
              <span style={styles.label}>Status</span>
              <span style={styles.value}>✅ Active</span>
            </div>
            <div style={styles.infoBox}>
              <span style={styles.label}>Days Remaining</span>
              <span style={styles.value}>{remaining} days</span>
            </div>
            <div style={styles.infoBox}>
              <span style={styles.label}>Started</span>
              <span style={styles.value}>{startDate.toLocaleDateString()}</span>
            </div>
            <div style={styles.infoBox}>
              <span style={styles.label}>Expires</span>
              <span style={styles.value}>{expiryDate.toLocaleDateString()}</span>
            </div>
            <div style={styles.infoBox}>
              <span style={styles.label}>Payment Method</span>
              <span style={styles.value}>{premiumData.paymentMethod === 'card' ? '💳 Card' : premiumData.paymentMethod === 'upi' ? '📱 UPI' : '🅿️ PayPal'}</span>
            </div>
            <div style={styles.infoBox}>
              <span style={styles.label}>Paid Amount</span>
              <span style={styles.value}>{currencySymbol}{premiumData.price}</span>
            </div>
          </div>

          <button
            onClick={() => setShowPayment(true)}
            style={styles.renewBtn}
            onMouseEnter={(e) => e.target.style.background = '#667eea'}
            onMouseLeave={(e) => e.target.style.background = '#764ba2'}
          >
            🔄 Renew Premium
          </button>
        </div>

        {showPayment && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <h3>Renew Premium</h3>
              <div style={styles.currencyTag}>
                Currency: {currency} ({currencySymbol})
              </div>
              <form onSubmit={handlePayment} style={styles.form}>
                <label style={styles.label}>Duration (Days)</label>
                <select 
                  value={daysCount} 
                  onChange={(e) => setDaysCount(parseInt(e.target.value))}
                  style={styles.input}
                >
                  <option value={30}>30 Days - {currencySymbol}{getPrice(30)}</option>
                  <option value={90}>90 Days - {currencySymbol}{getPrice(90)}</option>
                  <option value={180}>180 Days - {currencySymbol}{getPrice(180)}</option>
                  <option value={365}>1 Year - {currencySymbol}{getPrice(365)}</option>
                </select>

                <label style={styles.label}>Payment Method</label>
                <select 
                  value={paymentMethod} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={styles.input}
                >
                  <option value="card">💳 Credit/Debit Card</option>
                  <option value="upi">📱 UPI</option>
                  <option value="paypal">🅿️ PayPal</option>
                </select>

                <div style={styles.priceBox}>
                  <span>Total:</span>
                  <span style={styles.price}>{currencySymbol}{calculatePrice()}</span>
                </div>

                <button 
                  type="submit" 
                  disabled={isProcessing}
                  style={{...styles.payBtn, opacity: isProcessing ? 0.6 : 1}}
                >
                  {isProcessing ? '⏳ Processing...' : '💳 Pay Now'}
                </button>

                <button 
                  type="button"
                  onClick={() => setShowPayment(false)}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}

        {message && <p style={styles.message}>{message}</p>}
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.premiumCard}>
        <div style={styles.currencyTag}>
          Detected Currency: {currency} ({currencySymbol})
        </div>

        <h2 style={styles.cardTitle}>🚀 Go Premium</h2>
        <p style={styles.cardDesc}>Unlock unlimited downloads with no ads</p>

        <div style={styles.features}>
          <div style={styles.feature}>✨ 1080p & Best Quality</div>
          <div style={styles.feature}>⚡ Faster Downloads</div>
          <div style={styles.feature}>🎵 MP3 Max Quality</div>
          <div style={styles.feature}>📥 Batch Downloads</div>
          <div style={styles.feature}>🚫 No Ads</div>
          <div style={styles.feature}>♾️ Unlimited Access</div>
        </div>

        <div style={styles.pricing}>
          {getPricingOptions().map(option => (
            <div key={option.days} style={styles.priceOption}>
              <span style={styles.priceDays}>{option.label}</span>
              <span style={styles.priceAmount}>{currencySymbol}{getPrice(option.days)}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowPayment(true)}
          style={styles.upgradeBtn}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          🔓 Upgrade to Premium
        </button>

        {showPayment && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <h3>Buy Premium</h3>
              <div style={styles.currencyTag}>
                Currency: {currency} ({currencySymbol})
              </div>
              <form onSubmit={handlePayment} style={styles.form}>
                <label style={styles.label}>Duration (Days)</label>
                <select 
                  value={daysCount} 
                  onChange={(e) => setDaysCount(parseInt(e.target.value))}
                  style={styles.input}
                >
                  <option value={30}>30 Days - {currencySymbol}{getPrice(30)}</option>
                  <option value={90}>90 Days - {currencySymbol}{getPrice(90)}</option>
                  <option value={180}>180 Days - {currencySymbol}{getPrice(180)}</option>
                  <option value={365}>1 Year - {currencySymbol}{getPrice(365)}</option>
                </select>

                <label style={styles.label}>Payment Method</label>
                <select 
                  value={paymentMethod} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={styles.input}
                >
                  <option value="card">💳 Credit/Debit Card</option>
                  <option value="upi">📱 UPI</option>
                  <option value="paypal">🅿️ PayPal</option>
                </select>

                <div style={styles.priceBox}>
                  <span>Total:</span>
                  <span style={styles.price}>{currencySymbol}{calculatePrice()}</span>
                </div>

                <button 
                  type="submit" 
                  disabled={isProcessing}
                  style={{...styles.payBtn, opacity: isProcessing ? 0.6 : 1}}
                >
                  {isProcessing ? '⏳ Processing...' : '💳 Pay Now'}
                </button>

                <button 
                  type="button"
                  onClick={() => setShowPayment(false)}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}

        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    margin: '20px 0',
    padding: '20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '12px',
    color: 'white'
  },
  currencyTag: {
    display: 'inline-block',
    background: 'rgba(255, 255, 255, 0.2)',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '12px',
    marginBottom: '15px',
    border: '1px solid rgba(255, 255, 255, 0.3)'
  },
  premiumCard: {
    textAlign: 'center',
    padding: '30px'
  },
  cardTitle: {
    fontSize: '32px',
    marginBottom: '10px'
  },
  cardDesc: {
    fontSize: '16px',
    opacity: 0.9,
    marginBottom: '20px'
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '12px',
    margin: '20px 0',
    textAlign: 'left'
  },
  feature: {
    background: 'rgba(255, 255, 255, 0.1)',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px'
  },
  pricing: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '15px',
    margin: '25px 0',
  },
  priceOption: {
    background: 'rgba(255, 255, 255, 0.1)',
    padding: '20px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  priceDays: {
    fontSize: '14px',
    opacity: 0.8
  },
  priceAmount: {
    fontSize: '24px',
    fontWeight: 'bold'
  },
  upgradeBtn: {
    background: 'white',
    color: '#764ba2',
    border: 'none',
    padding: '14px 40px',
    fontSize: '16px',
    fontWeight: 'bold',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  activePremium: {
    background: 'rgba(255, 255, 255, 0.1)',
    padding: '20px',
    borderRadius: '8px'
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px'
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '15px',
    marginBottom: '20px'
  },
  infoBox: {
    background: 'rgba(255, 255, 255, 0.1)',
    padding: '15px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  label: {
    fontSize: '12px',
    opacity: 0.8
  },
  value: {
    fontSize: '16px',
    fontWeight: 'bold'
  },
  renewBtn: {
    background: 'white',
    color: '#764ba2',
    border: 'none',
    padding: '12px 30px',
    fontSize: '14px',
    fontWeight: 'bold',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modalContent: {
    background: 'white',
    padding: '30px',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '400px',
    color: 'black'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px'
  },
  priceBox: {
    display: 'flex',
    justifyContent: 'space-between',
    background: '#f0f0f0',
    padding: '15px',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  price: {
    color: '#667eea',
    fontSize: '20px'
  },
  payBtn: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  cancelBtn: {
    background: '#f0f0f0',
    border: 'none',
    padding: '12px',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  message: {
    marginTop: '15px',
    padding: '12px',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '6px',
    fontSize: '14px'
  }
};

export default PremiumSection;
