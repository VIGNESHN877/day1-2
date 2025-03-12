/* console.log("code io") // this a one line code
// alert(hollo)
 */
countdownTime = 600000; // 10 minutes in milliseconds
let countdownInterval;

function updateCountdown() {
    if (countdownTime <= 0) {
        clearInterval(countdownInterval);
        alert("Time's up!");
        return;
    }
    document.getElementById('display').textContent = formatTime(countdownTime);
    countdownTime -= 1000;
}

function startCountdown() {
    if (!countdownInterval) {
        countdownInterval = setInterval(updateCountdown, 1000);
    }
}

function stopCountdown() {
    clearInterval(countdownInterval);
    countdownInterval = null;
}

function resetCountdown() {
    stopCountdown();
    countdownTime = 600000; // Reset to 10 minutes
    document.getElementById('display').textContent = formatTime(countdownTime);
} 
