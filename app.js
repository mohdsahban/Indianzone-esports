// IndianZone Esports App Logic

let currentScreen = 'scrHome';

function navigate(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(screenId);
  if (target) target.classList.add('active');
  currentScreen = screenId;

  // Bottom navigation tab highlights
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
  const coins = parseFloat(localStorage.getItem('iz_coins') || '0.00');
  const winCoins = parseFloat(localStorage.getItem('iz_win_coins') || '0.00');
  const hasJoined = localStorage.getItem('iz_joined_101') === 'true';

  const coinStr = coins.toFixed(2);
  if (document.getElementById('topCoinCount')) document.getElementById('topCoinCount').innerText = coinStr;
  if (document.getElementById('wallTotalCoin')) document.getElementById('wallTotalCoin').innerText = coinStr;
  if (document.getElementById('wallPlayCoin')) document.getElementById('wallPlayCoin').innerText = coinStr;
  if (document.getElementById('wallWinCoin')) document.getElementById('wallWinCoin').innerText = winCoins.toFixed(2);
  if (document.getElementById('profTopCoin')) document.getElementById('profTopCoin').innerText = coinStr;

  // Custom Room details check
  const rId = localStorage.getItem('iz_room_id');
  const rPass = localStorage.getItem('iz_room_pass');

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

    const myMatchContainer = document.getElementById('joinedMatchesList');
    if (myMatchContainer) {
      myMatchContainer.innerHTML = `
        <div class="bg-[#141822] border border-blue-500/30 rounded-2xl p-4">
          <div class="flex justify-between items-start">
            <div>
              <span class="text-[10px] bg-blue-500/20 text-blue-400 font-bold px-2 py-0.5 rounded">UPCOMING</span>
              <h4 class="text-sm font-bold mt-1 text-white">Daily Squad Championship #101</h4>
            </div>
            <span class="text-xs text-amber-400 font-bold font-mono">8:00 PM</span>
          </div>
          <p class="text-[11px] text-gray-400 mt-2">Room ID & Pass match se 15 min pehle reveal hogi.</p>
        </div>
      `;
    }
  }
}

// Payment method selector
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
  pending.push({ user: "Saban Khan", amount: amt, utr: utr, time: new Date().toLocaleTimeString() });
  localStorage.setItem('iz_pending_coins', JSON.stringify(pending));

  alert("Payment proof submit ho gaya! Admin verify karke aapke wallet me coins add kar dega.");
  document.getElementById('coinAmountInput').value = '';
  document.getElementById('depositUtrNumber').value = '';
  navigate('scrWallet');
}

function handleJoinMatch() {
  let coins = parseFloat(localStorage.getItem('iz_coins') || '0.00');
  if (coins < 30) {
    alert("Coins kam hain! Pehle wallet me jakar 30 coins add karein.");
    navigate('scrAddCoin');
    return;
  }

  const ign = prompt("Free Fire In-Game Name (IGN) enter karein:");
  if (!ign) return;
  const uid = prompt("Free Fire UID enter karein:");
  if (!uid) return;

  coins -= 30;
  localStorage.setItem('iz_coins', coins);
  localStorage.setItem('iz_joined_101', 'true');

  let list = JSON.parse(localStorage.getItem('iz_match_players') || '[]');
  list.push({ ign: ign, uid: uid });
  localStorage.setItem('iz_match_players', JSON.stringify(list));

  alert("Match Join Successful!");
  syncAppState();
  navigate('scrMyMatches');
}

function setWithdrawVal(val) {
  const currentBal = parseFloat(localStorage.getItem('iz_coins') || '0.00');
  if (currentBal < val) {
    alert("Aapke paas withdrawal ke liye itne coins nahi hain!");
    return;
  }
  const upi = document.getElementById('withdrawUpiId').value;
  if (!upi) {
    alert("Pehle apna UPI ID daalein!");
    return;
  }

  localStorage.setItem('iz_coins', currentBal - val);
  alert("Withdrawal request of ₹" + val + " submitted to " + upi + "!");
  syncAppState();
  navigate('scrWallet');
}

document.addEventListener('DOMContentLoaded', () => {
  syncAppState();
});
