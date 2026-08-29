// ==========================================================================
// MODERN WEB AUTHENTICATION SCREENS — Client Interactions
// Pure Vanilla JavaScript (ES6+)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
});

// Switch Active Authentication Screen
function switchAuthScreen(screenKey) {
  // Hide all panels
  const panels = document.querySelectorAll('.auth-card-panel');
  panels.forEach(p => p.classList.remove('active'));

  // Show target panel
  const target = document.getElementById(`screen-${screenKey}`);
  if (target) {
    target.classList.add('active');
  }

  // Update demo navigation pills if present
  const pills = document.querySelectorAll('.demo-pill');
  pills.forEach(p => p.classList.remove('active'));

  const keyMap = { welcome: 0, login: 1, signup: 2, otp: 3, forgot: 4 };
  if (keyMap[screenKey] !== undefined && pills[keyMap[screenKey]]) {
    pills[keyMap[screenKey]].classList.add('active');
  }

  // Re-init lucide icons for fresh views
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Toggle Password Visibility
function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;

  if (input.type === 'password') {
    input.type = 'text';
    btn.innerHTML = '<i data-lucide="eye-off" class="icon-toggle"></i>';
  } else {
    input.type = 'password';
    btn.innerHTML = '<i data-lucide="eye" class="icon-toggle"></i>';
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Password Strength Meter
function checkPasswordStrength(password) {
  const fill = document.getElementById('strength-fill');
  if (!fill) return;

  let score = 0;
  if (password.length >= 8) score += 25;
  if (/[A-Z]/.test(password)) score += 25;
  if (/[0-9]/.test(password)) score += 25;
  if (/[^A-Za-z0-9]/.test(password)) score += 25;

  fill.style.width = `${score}%`;
  if (score <= 25) {
    fill.style.backgroundColor = '#EF4444'; // Red
  } else if (score <= 50) {
    fill.style.backgroundColor = '#F59E0B'; // Orange
  } else if (score <= 75) {
    fill.style.backgroundColor = '#3B82F6'; // Blue
  } else {
    fill.style.backgroundColor = '#10B981'; // Green
  }
}

// OTP Auto-Focus Navigation
function onOtpInput(input, index) {
  const boxes = document.querySelectorAll('.otp-box');
  if (input.value.length === 1 && index < boxes.length - 1) {
    boxes[index + 1].focus();
  }
}

function onOtpKeyDown(event, index) {
  const boxes = document.querySelectorAll('.otp-box');
  if (event.key === 'Backspace' && !boxes[index].value && index > 0) {
    boxes[index - 1].focus();
  }
}

// Form Handlers
function handleLoginSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  alert(`👋 Welcome back! Login successful for ${email}. Session authenticated.`);
}

function handleSignupSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('signup-email').value;
  const target = document.getElementById('otp-target-email');
  if (target) target.textContent = email;

  // Move to 2FA verification step
  switchAuthScreen('otp');
}

function handleOtpSubmit(e) {
  e.preventDefault();
  const boxes = document.querySelectorAll('.otp-box');
  let code = '';
  boxes.forEach(b => code += b.value);

  if (code.length < 6) {
    alert('Please enter all 6 digits of the verification code.');
    return;
  }

  alert(`🎉 Account verified! Welcome to the platform. Code [${code}] validated successfully.`);
  switchAuthScreen('welcome');
}

function handleForgotSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('forgot-email').value;
  alert(`📩 Password reset link dispatched to ${email}. Check your inbox!`);
  switchAuthScreen('login');
}

function simulateSocialAuth(provider) {
  alert(`Connecting with ${provider} OAuth... Authenticated successfully.`);
}

function resendOtp() {
  alert('A new 6-digit code has been dispatched to your email.');
}
