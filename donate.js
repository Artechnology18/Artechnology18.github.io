// Toggle mobile menu
function toggleMenu() {
  const navLinks = document.querySelector('.nav-links');
  navLinks.classList.toggle('active');
}

// Amount selection
const amountBtns = document.querySelectorAll('.amount-btn');
const customAmountInput = document.getElementById('customAmount');
let selectedAmount = 0;

amountBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    // Remove selected class from all buttons
    amountBtns.forEach(b => b.classList.remove('selected'));
    
    // Add selected class to clicked button
    this.classList.add('selected');
    
    // Set selected amount
    selectedAmount = parseInt(this.getAttribute('data-amount'));
    
    // Clear custom amount input
    customAmountInput.value = '';
  });
});

// Custom amount input
customAmountInput.addEventListener('input', function() {
  // Remove selected class from all buttons
  amountBtns.forEach(b => b.classList.remove('selected'));
  
  // Set selected amount to custom value
  selectedAmount = parseInt(this.value) || 0;
});

// FAQ Toggle
function toggleFAQ(element) {
  const faqItem = element.parentElement;
  faqItem.classList.toggle('active');
}

// Payment Handlers

// Razorpay Payment Integration
function handleRazorpayPayment() {
  if (!validateDonation()) return;

  const options = {
    key: 'rzp_live_SErRnbhjCTcNGl', // Your Razorpay Key ID
    amount: selectedAmount * 100, // Amount in paise (1 INR = 100 paise)
    currency: 'INR',
    name: 'AR Technology',
    description: 'Donation',
    image: 'https://your-logo-url.com/logo.png', // Optional: Add your logo URL
    handler: function (response) {
      // Payment successful - close modal and show success
      setTimeout(() => {
        handlePaymentSuccess(response, 'Razorpay');
      }, 500);
    },
    prefill: {
      name: document.getElementById('donorName').value || '',
      email: document.getElementById('donorEmail').value || '',
      contact: document.getElementById('donorEmail').value || '',
    },
    notes: {
      message: document.getElementById('donorMessage').value || 'No message',
    },
    theme: {
      color: '#950286',
    },
    modal: {
      ondismiss: function() {
        // Only show cancellation if payment wasn't completed
        const existingModal = document.querySelector('.success-modal-overlay');
        if (!existingModal) {
          showNotification('Payment cancelled', 'info');
        }
      },
      escape: true,
      backdropclose: false
    }
  };

  const razorpay = new Razorpay(options);
  razorpay.open();
}



// Validate donation before processing
function validateDonation() {
  // Check if amount is selected
  if (selectedAmount < 1) {
    showNotification('Please enter a donation amount', 'error');
    return false;
  }

  // Check terms and conditions
  const termsCheck = document.getElementById('termsCheck');
  if (!termsCheck.checked) {
    showNotification('Please agree to the terms and conditions', 'error');
    return false;
  }

  return true;
}

// Handle successful payment
function handlePaymentSuccess(response, paymentMethod) {
  console.log('Payment successful:', response);
  
  // Get donor details
  const donorData = {
    name: document.getElementById('donorName').value || 'Anonymous',
    email: document.getElementById('donorEmail').value || '',
    message: document.getElementById('donorMessage').value || '',
    amount: selectedAmount,
    paymentMethod: paymentMethod,
    paymentId: response.razorpay_payment_id || response.id || 'N/A',
    timestamp: new Date().toISOString(),
  };

  // Here you would typically send this data to your backend
  // to save the donation record and send confirmation email
  
  // Example:
  // fetch('/api/save-donation', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(donorData),
  // });

  // Show success message
  showSuccessModal(donorData);
  
  // Reset form
  resetForm();
}

// Show success modal
function showSuccessModal(donorData) {
  // Scroll to top for better visibility
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  const modalHTML = `
    <div class="success-modal-overlay" onclick="closeSuccessModal()">
      <div class="success-modal" onclick="event.stopPropagation()">
        <div class="success-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <h2>Thank You for Your Donation!</h2>
        <p>Your support means the world to us.</p>
        <div class="donation-details">
          <p><strong>Amount:</strong> ₹${donorData.amount}</p>
          <p><strong>Payment ID:</strong> ${donorData.paymentId}</p>
          <p><strong>Method:</strong> ${donorData.paymentMethod}</p>
          <p><strong>Status:</strong> <span style="color: #27ae60;">✓ Successful</span></p>
        </div>
        <p class="email-note">A receipt has been sent to your email address.</p>
        <button class="close-modal-btn" onclick="closeSuccessModal()">Done</button>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // Hide notification if any
  const notification = document.querySelector('.notification');
  if (notification) {
    notification.remove();
  }
}

// Close success modal
function closeSuccessModal() {
  const modal = document.querySelector('.success-modal-overlay');
  if (modal) {
    modal.style.opacity = '0';
    setTimeout(() => {
      modal.remove();
      // Scroll back to donation form
      document.querySelector('.donation-form').scrollIntoView({ behavior: 'smooth' });
    }, 300);
  }
}

// Reset form
function resetForm() {
  selectedAmount = 0;
  amountBtns.forEach(b => b.classList.remove('selected'));
  customAmountInput.value = '';
  document.getElementById('donorName').value = '';
  document.getElementById('donorEmail').value = '';
  document.getElementById('donorMessage').value = '';
  document.getElementById('termsCheck').checked = false;
}

// Show notification
function showNotification(message, type = 'info') {
  // Remove existing notification if any
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  const notificationHTML = `
    <div class="notification ${type}">
      <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
      <span>${message}</span>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', notificationHTML);
  
  // Auto remove after 4 seconds
  setTimeout(() => {
    const notification = document.querySelector('.notification');
    if (notification) {
      notification.classList.add('fade-out');
      setTimeout(() => notification.remove(), 300);
    }
  }, 4000);
}

// Add notification styles dynamically
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
  .notification {
    position: fixed;
    top: 80px;
    right: 20px;
    background: white;
    padding: 15px 25px;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 999999;
    animation: slideIn 0.3s ease;
    max-width: 400px;
  }

  .notification.error {
    border-left: 4px solid #e74c3c;
  }

  .notification.error i {
    color: #e74c3c;
  }

  .notification.success {
    border-left: 4px solid #27ae60;
  }

  .notification.success i {
    color: #27ae60;
  }

  .notification.info {
    border-left: 4px solid #3498db;
  }

  .notification.info i {
    color: #3498db;
  }

  .notification i {
    font-size: 1.5rem;
  }

  .notification.fade-out {
    animation: slideOut 0.3s ease;
  }

  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }

  .success-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999999;
    animation: fadeIn 0.3s ease;
    transition: opacity 0.3s ease;
  }

  .success-modal {
    background: white;
    padding: 40px;
    border-radius: 15px;
    text-align: center;
    max-width: 500px;
    width: 90%;
    animation: scaleIn 0.3s ease;
  }

  .success-icon {
    font-size: 5rem;
    color: #27ae60;
    margin-bottom: 20px;
  }

  .success-modal h2 {
    color: #3f013f;
    margin-bottom: 15px;
    font-size: 2rem;
  }

  .success-modal p {
    color: #666;
    margin-bottom: 20px;
    line-height: 1.6;
  }

  .donation-details {
    background: #f9f9f9;
    padding: 20px;
    border-radius: 10px;
    margin: 20px 0;
  }

  .donation-details p {
    margin: 10px 0;
    color: #333;
  }

  .email-note {
    font-size: 0.9rem;
    color: #666;
    font-style: italic;
  }

  .close-modal-btn {
    background: linear-gradient(135deg, #3f013f, #950286);
    color: white;
    border: none;
    padding: 12px 40px;
    border-radius: 8px;
    font-size: 1.1rem;
    cursor: pointer;
    margin-top: 20px;
    transition: transform 0.3s;
  }

  .close-modal-btn:hover {
    transform: scale(1.05);
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes scaleIn {
    from {
      transform: scale(0.8);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
`;
document.head.appendChild(notificationStyles);

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  console.log('Donate page loaded successfully!');
  
  // Add animation to stats on scroll
  const observerOptions = {
    threshold: 0.5
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  document.querySelectorAll('.stat-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
  });
});
