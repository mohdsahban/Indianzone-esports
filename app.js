// IndianZone Real Multi-User Engine

let currentScreen = 'scrHome';
let currentUser = null;

// Auth Tab Switch
function switchAuth(type) {
  if (type === 'login') {
    document.getElementById('formLogin').classList.remove('hidden');
    document.getElementById('formRegister').classList.add('hidden');
    document.getElementById('tabLogin').classList.add('border-b-2', 'border-blue-500', 'text-blue-400');
    document.getElementById('tabLogin').classList.remove('text-gray-500');
    document.getElementById('tabRegister').classList.remove('border-b-2', 'border-blue-500', 'text-blue-400');
    document.getElementById('tabRegister').classList.add('text-gray-500');
  } else {
    document.getElementById('formRegister').classList.remove('hidden');
    document.getElementById('formLogin').classList.add('hidden');
    document.getElementById('tabRegister').classList.add('border-b-2', 'border-blue-500', 'text-blue-400');
    document.getElementById('tabRegister').classList.remove('text-gray-500');
    document.getElementById('tabLogin').classList.remove('border-b-2', 'border-blue-500', 'text-blue-400');
    document.getElementById('tabLogin').classList.add('text-gray-500');
  }
}

// User Registration
function handleRegister() {
  const name = document.getElementById('regName').value.trim();
  const phone = document.getElementById('regPhone').value.trim();
  const email = document.getElementById('regEmail').value.trim() || `${phone}@indianzone.in`;
  const pass = document.getElementById('regPass').value;

  if (!name || phone.length < 10 || pass.length < 4) {
    alert("Please enter Name, valid 10-digit Phone, and Password!");
    return;
  }

  let users = JSON.parse(localStorage.getItem('iz_registered_users') || '{}');
  if (users[phone]) {
    alert("Yeh mobile number pehle se registered hai! Login karein.");
    switchAuth('login');
    return;
  }

  users[phone] = {
    name: name,
    phone: phone,
    email: email,
    password: pass,
    coins: 0.00,
    winCoins: 0.00,
    joinedMatches: []
  };

  localStorage.setItem('iz_registered_users', JSON.stringify(users));
  alert("Account ban gaya! Ab login karein.");
  switchAuth('login');
  document.getElementById('loginPhone').value = phone;
}

// User Login
function handleLogin() {
  const phone = document.getElementById('loginPhone').value.trim();
  const pass = document.getElementById('loginPass').value;

  let users = JSON.parse(localStorage.getItem('iz_registered_users') || '{}');
  const user = users[phone];

  if (!user || user.password !== pass) {
    alert("Galat Phone Number ya Password!");
    return;
  }

  currentUser = user;
  localStorage.setItem('iz_active_session', phone);
  bootApp();
}

function handleLogout() {
  localStorage.removeItem('iz_active_session');
  currentUser = null;
  location.reload();
}

function bootApp() {
  document.getElementById('scrAuth').classList.add('hidden');
  document.getElementById('appContainer').classList.remove('hidden');
  
  // Profile Update
  document.getElementById('profileName').innerText = currentUser.name;
  document.getElementById('profilePhone').innerText = "+91 " + currentUser.phone;
  document.getElementById('profileEmail').innerText = currentUser.email;
  document.getElementById('userAvatar').innerText = currentUser.name.charAt(0).toUpperCase();

  syncAppState();
  navigate('scrHome');
}

function navigate(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(screenId);
  if (target) target.classList.add('active');
  currentScreen = screenId;

  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('nav-active'));
  if (screenId === 'scrHome') document.getElementById('navHome')?.classList.add('nav-active');
  if (screenId === 'scrMyMatches') document.getElementById('navMatches')?.classList.add('nav-active');
  if (screenId === 'scrWallet' || screenId === 'scrAddCoin' || screenId === 'scrWithdraw') {
    document.getElementById('navWallet')?.classList.add('nav-active');
  }
  if (screenId === 'scrProfile') document.getElementById('navProfile')?.classList.add('nav-active');

  syncAppState();
}

function syncAppState() {
  if (!currentUser) return;

  let users = JSON.parse(localStorage.getItem('iz_registered_users') || '{}');
  currentUser = users[currentUser.phone] || currentUser;

  const coinStr = (currentUser.coins || 0).toFixed(2);
  const winStr = (currentUser.winCoins || 0).toFixed(2);

  if (document.getElementById('topCoinCount')) document.getElementById('topCoinCount').innerText = coinStr;
  if (document.getElementById('wallTotalCoin')) document.getElementById('wallTotalCoin').innerText = coinStr;
  if (document.getElementById('wallPlayCoin')) document.getElementById('wallPlayCoin').innerText = coinStr;
  if (document.getElementById('wallWinCoin')) document.getElementById('wallWinCoin').innerText = winStr;
  if (document.getElementById('profTopCoin')) document.getElementById('profTopCoin').innerText = coinStr;

  // Custom Room details check
  const rId = localStorage.getItem('iz_room_id');
  const rPass = localStorage.getItem('iz_room_pass');
  const hasJoined = currentUser.joinedMatches && currentUser.joinedMatches.includes(101);

  if (hasJoined) {
    const btn = document.getElementById('joinMatchBtn');
    if (btn) {
      btn.innerText = 'Joined Successfully';
      btn.classList.remove('bg-[#1d8cf8]');
      btn.classList.add('bg-gray-800', 'text-gray-400', 'cursor-not-allowed');
      btn.disabled = true;
    }

    const box = document.getElementById('roomAlertBox');
    if (box && rId && rPass) {
      box.classList.remove('hidden');
      document.getElementById('userRoomIdDisplay').innerText = rId;
      document.getElementById('userRoomPassDisplay').innerText = rPass;
    }
  }
}

// Payment method
function selectPayMethod(name) {
  document.querySelectorAll('.pay-method').forEach(m => {
    m.classList.remove('border-emerald-500', 'border-2');
    m.classList.add('border-gray-800');
  });
  const el = document.getElementById('opt' + name);
  if (el) {
    el.classList.add('border-emerald-500', 'border-2');
    el.classList.remove('border-gray-800');
  }
}

function setCoinInput(val) {
  document.getElementById('coinAmountInput').value = val;
}

function submitAddCoinProof() {
  const amt = document.getElementById('coinAmountInput').value;
  const utr = document.getElementById('depositUtrNumber').value;
  if (!amt || !utr) {
    alert("Please coin amount aur UTR number dono fill karein!");
    return;
  }

  let pending = JSON.parse(localStorage.getItem('iz_pending_coins') || '[]');
  pending.push({ userPhone: currentUser.phone, userName: currentUser.name, amount: amt, utr: utr, time: new Date().toLocaleTimeString() });
  localStorage.setItem('iz_pending_coins', JSON.stringify(pending));

  alert("Payment proof submit ho gaya! Admin verify karke aapke wallet me coins add kar dega.");
  document.getElementById('coinAmountInput').value = '';
  document.getElementById('depositUtrNumber').value = '';
  navigate('scrWallet');
}

function handleJoinMatch() {
  if (currentUser.coins < 30) {
    alert("Coins kam hain! Pehle wallet me jakar 30 coins add karein.");
    navigate('scrAddCoin');
    return;
  }

  const ign = prompt("Free Fire In-Game Name (IGN) enter karein:");
  if (!ign) return;
  const uid = prompt("Free Fire UID enter karein:");
  if (!uid) return;

  currentUser.coins -= 30;
  if (!currentUser.joinedMatches) currentUser.joinedMatches = [];
  currentUser.joinedMatches.push(101);

  // Update in DB
  let users = JSON.parse(localStorage.getItem('iz_registered_users') || '{}');
  users[currentUser.phone] = currentUser;
  localStorage.setItem('iz_registered_users', JSON.stringify(users));

  let list = JSON.parse(localStorage.getItem('iz_match_players') || '[]');
  list.push({ phone: currentUser.phone, ign: ign, uid: uid });
  localStorage.setItem('iz_match_players', JSON.stringify(list));

  alert("Match Join Successful!");
  syncAppState();
  navigate('scrMyMatches');
}

function submitWithdrawal() {
  const amt = parseFloat(document.getElementById('withdrawAmt').value || '0');
  const upi = document.getElementById('withdrawUpiId').value.trim();

  if (!upi || amt < 50) {
    alert("Min withdrawal 50 Coins hai aur valid UPI ID daalna zaroori hai!");
    return;
  }

  if (currentUser.coins < amt) {
    alert("Wallet me itne coins nahi hain!");
    return;
  }

  currentUser.coins -= amt;
  let users = JSON.parse(localStorage.getItem('iz_registered_users') || '{}');
  users[currentUser.phone] = currentUser;
  localStorage.setItem('iz_registered_users', JSON.stringify(users));

  alert("Withdrawal request of ₹" + amt + " submitted to " + upi + "!");
  syncAppState();
  navigate('scrWallet');
}

// Session Check
document.addEventListener('DOMContentLoaded', () => {
  const sessionPhone = localStorage.getItem('iz_active_session');
  if (sessionPhone) {
    let users = JSON.parse(localStorage.getItem('iz_registered_users') || '{}');
    if (users[sessionPhone]) {
      currentUser = users[sessionPhone];
      bootApp();
    }
  }
});
