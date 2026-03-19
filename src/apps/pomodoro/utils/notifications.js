let audioContext = null;

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

export function playCompletionSound() {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.3);
  } catch (err) {
    console.log('Could not play sound:', err);
  }
}

export function vibrate() {
  if ('vibrate' in navigator) {
    navigator.vibrate([200, 100, 200]);
  }
}

export function playNotification(soundEnabled, vibrationEnabled) {
  if (soundEnabled) {
    playCompletionSound();
  }
  if (vibrationEnabled) {
    vibrate();
  }
}
