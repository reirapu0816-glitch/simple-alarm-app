const hourInput = document.getElementById('hourInput');
const minuteInput = document.getElementById('minuteInput');
const alarmToggle = document.getElementById('alarmToggle');
const alarmStatus = document.getElementById('alarmStatus');
const currentTimeDisplay = document.getElementById('currentTime');
const stopButton = document.getElementById('stopButton');

let alarmActive = false;
let alarmRinging = false;
let audioContext = null;
let oscillator = null;
let gainNode = null;

function updateCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    currentTimeDisplay.textContent = `${hours}:${minutes}:${seconds}`;

    if (alarmActive && !alarmRinging) {
        checkAlarm(now);
    }
}

function checkAlarm(now) {
    const alarmHour = parseInt(hourInput.value) || 0;
    const alarmMinute = parseInt(minuteInput.value) || 0;

    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    if (currentHour === alarmHour && currentMinute === alarmMinute) {
        ringAlarm();
    }
}

function ringAlarm() {
    alarmRinging = true;
    stopButton.style.display = 'block';
    playSound();
}

function stopAlarm() {
    alarmRinging = false;
    alarmToggle.checked = false;
    alarmActive = false;
    updateAlarmStatus();
    stopButton.style.display = 'none';
    stopSound();
}

function playSound() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    gainNode = audioContext.createGain();
    oscillator = audioContext.createOscillator();

    oscillator.type = 'sine';
    oscillator.frequency.value = 800;

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();
}

function stopSound() {
    if (oscillator) {
        oscillator.stop();
        oscillator = null;
    }
    if (gainNode) {
        gainNode.disconnect();
        gainNode = null;
    }
}

function updateAlarmStatus() {
    if (alarmToggle.checked) {
        alarmActive = true;
        alarmStatus.textContent = 'On';
        alarmStatus.style.color = '#667eea';
    } else {
        alarmActive = false;
        alarmStatus.textContent = 'Off';
        alarmStatus.style.color = '#999';
    }
}

alarmToggle.addEventListener('change', updateAlarmStatus);
stopButton.addEventListener('click', stopAlarm);

setInterval(updateCurrentTime, 1000);
updateCurrentTime();
