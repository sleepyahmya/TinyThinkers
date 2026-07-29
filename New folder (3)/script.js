




const homeScreen = document.getElementById('homeScreen');
const gameScreen = document.getElementById('gameScreen');
const operationsGrid = document.getElementById('operationsGrid');
const levelGrid = document.getElementById('levelGrid');
const startBtn = document.getElementById('startBtn');
const scoreDisplay = document.getElementById('scoreDisplay');
const streakDisplay = document.getElementById('streakDisplay');
const livesDisplay = document.getElementById('livesDisplay');
const timerDisplay = document.getElementById('timerDisplay');
const currentOpEmoji = document.getElementById('currentOpEmoji');
const currentOpLabel = document.getElementById('currentOpLabel');
const num1Display = document.getElementById('num1Display');
const num2Display = document.getElementById('num2Display');
const opDisplay = document.getElementById('opDisplay');
const answerInput = document.getElementById('answerInput');
const questionPrompt = document.getElementById('questionPrompt');
const questionCard = document.getElementById('questionCard');
const reactionBuddy = document.getElementById('reactionBuddy');
const generateBtn = document.getElementById('generateBtn');
const checkBtn = document.getElementById('checkBtn');
const hintBtn = document.getElementById('hintBtn');
const hintCard = document.getElementById('hintCard');
const hintOverlay = document.getElementById('hintOverlay');
const hintContent = document.getElementById('hintContent');
const closeHintBtn = document.getElementById('closeHintBtn');
const backHomeBtn = document.getElementById('backHomeBtn');
const answerModal = document.getElementById('answerModal');
const modalIcon = document.getElementById('modalIcon');
const modalTitle = document.getElementById('modalTitle');
const modalEquation = document.getElementById('modalEquation');
const modalMessage = document.getElementById('modalMessage');
const modalScore = document.getElementById('modalScore');
const modalIQ = document.getElementById('modalIQ');
const modalNextBtn = document.getElementById('modalNextBtn');
const confettiContainer = document.getElementById('confettiContainer');
const musicToggle = document.getElementById('musicToggle');




let selectedOperation = null;
let selectedLevel = null;
let currentNum1 = null;
let currentNum2 = null;
let currentOperator = null;
let currentAnswer = null;
let score = 0;
let streak = 0;
let lives = 3;
let iq = 100;
let questionGenerated = false;
let timeRemaining = 0;
let timerInterval = null;




let musicEnabled = true;
let musicCtx = null;
let musicGain = null;
let musicPlaying = false;
let musicInterval = null;


function initMusic() {
    try {
        musicCtx = new (window.AudioContext || window.webkitAudioContext)();
        musicGain = musicCtx.createGain();
        musicGain.gain.value = 0.18; 
        musicGain.connect(musicCtx.destination);
    } catch(e) {
        musicEnabled = false;
    }
}


function playMelodyNote(freq, startTime, duration, vol = 0.14, type = 'sine') {
    if (!musicCtx || !musicGain) return;
    try {
        const osc = musicCtx.createOscillator();
        const g = musicCtx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        g.gain.setValueAtTime(0, startTime);
        g.gain.linearRampToValueAtTime(vol, startTime + 0.04);
        g.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        osc.connect(g);
        g.connect(musicGain);
        osc.start(startTime);
        osc.stop(startTime + duration);
    } catch(e) {  }
}


function playChord(notes, startTime, duration, vol = 0.06) {
    notes.forEach(freq => playMelodyNote(freq, startTime, duration, vol));
}


const pentatonic = [262, 294, 330, 392, 440, 523, 588, 660, 784, 880];


function startMusic() {
    if (!musicEnabled || !musicCtx || musicPlaying) return;
    musicPlaying = true;

    function playPhrase() {
        if (!musicPlaying || !musicCtx) return;
        const now = musicCtx.currentTime;
        
        const melody = [0, 2, 4, 7, 9, 7, 4, 2, 0, 3, 5, 7, 9, 7, 5, 3];
        melody.forEach((step, i) => {
            const note = pentatonic[step % pentatonic.length];
            const toneType = i % 4 === 0 ? 'triangle' : 'sine';
            playMelodyNote(note, now + i * 0.33, 0.28, 0.12, toneType);
        });
        
        playMelodyNote(523, now + 0.2, 0.4, 0.08, 'triangle');
        playMelodyNote(659, now + 1.0, 0.35, 0.07, 'triangle');
        playMelodyNote(784, now + 1.8, 0.45, 0.06, 'triangle');
        
        playChord([262, 392, 523], now, 1.8, 0.05);
        playChord([294, 440, 587], now + 3.2, 1.8, 0.05);
    }

    playPhrase();
    musicInterval = setInterval(playPhrase, 6000);
}


function stopMusic() {
    musicPlaying = false;
    if (musicInterval) {
        clearInterval(musicInterval);
        musicInterval = null;
    }
}


function toggleMusic() {
    musicEnabled = !musicEnabled;
    if (musicEnabled) {
        musicToggle.querySelector('.music-icon-on').classList.remove('hidden');
        musicToggle.querySelector('.music-icon-off').classList.add('hidden');
        if (musicCtx && musicCtx.state === 'suspended') {
            musicCtx.resume();
        }
        startMusic();
    } else {
        musicToggle.querySelector('.music-icon-on').classList.add('hidden');
        musicToggle.querySelector('.music-icon-off').classList.remove('hidden');
        stopMusic();
    }
}





function playTone(freq, type = 'sine', duration = 0.15, volume = 0.25, delay = 0) {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(volume, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + duration);
    } catch(e) {  }
}


function playSuccessSound() {
    playTone(523, 'sine', 0.13, 0.25);
    playTone(659, 'sine', 0.13, 0.25, 0.1);
    playTone(784, 'sine', 0.13, 0.25, 0.2);
    playTone(1047, 'sine', 0.2, 0.3, 0.3);
}


function playErrorSound() {
    playTone(350, 'triangle', 0.18, 0.18);
    playTone(280, 'triangle', 0.22, 0.18, 0.15);
}


function playClickSound() {
    playTone(700, 'sine', 0.06, 0.12);
}


function playHintSound() {
    playTone(880, 'sine', 0.08, 0.12);
    playTone(1100, 'sine', 0.08, 0.12, 0.08);
    playTone(1320, 'sine', 0.1, 0.12, 0.16);
}


function playGameOverSound() {
    playTone(440, 'sine', 0.2, 0.2);
    playTone(392, 'sine', 0.2, 0.2, 0.2);
    playTone(349, 'sine', 0.2, 0.2, 0.4);
    playTone(330, 'sine', 0.35, 0.2, 0.6);
}









function launchConfetti() {
    const colors = [
        '#d49a6a', '#6c87a5', '#5a8ab5', '#6aaa6a', '#d4b84a',
        '#cc8a4a', '#cc7a6a', '#8899aa', '#7ac07a', '#e0c860',
        '#b8a87a', '#7aa0b8', '#a0b87a', '#8a9aaa'
    ];

    for (let i = 0; i < 60; i++) {
        const piece = document.createElement('div');
        piece.classList.add('confetti-piece');
        piece.style.left = `${Math.random() * 100}%`;
        piece.style.top = `-${10 + Math.random() * 30}px`;
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.setProperty('--fall-dur', `${2 + Math.random() * 3}s`);
        piece.style.setProperty('--fall-delay', `${Math.random() * 0.6}s`);
        piece.style.setProperty('--spin', `${360 + Math.random() * 720}deg`);
        piece.style.width = `${6 + Math.random() * 10}px`;
        piece.style.height = `${6 + Math.random() * 10}px`;
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        confettiContainer.appendChild(piece);

        
        setTimeout(() => piece.remove(), 3500);
    }
}


function showReactionBuddy(emoji) {
    reactionBuddy.textContent = emoji;
    reactionBuddy.classList.remove('show');
    void reactionBuddy.offsetWidth;
    reactionBuddy.classList.add('show');
    setTimeout(() => reactionBuddy.classList.remove('show'), 2000);
}





function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getOperatorSymbol() {
    switch (selectedOperation) {
        case 'addition': return '+';
        case 'subtraction': return '−';
        case 'multiplication': return '×';
        case 'division': return '÷';
        case 'random': return '?';
        default: return '?';
    }
}

function getLevelConfig(level) {
    const configs = {
        easy: { max: 10, time: 40 },
        medium: { max: 20, time: 30 },
        hard: { max: 30, time: 15 },
    };
    return configs[level] || configs.easy;
}

function isLevelSelectionVisible() {
    const levelCard = document.getElementById('levelCard');
    return levelCard && !levelCard.classList.contains('hidden');
}

function updateStartButtonState() {
    const btnText = startBtn.querySelector('.btn-text');
    if (!selectedOperation) {
        startBtn.classList.add('hidden');
        startBtn.disabled = true;
        if (btnText) btnText.textContent = 'Next';
        return;
    }

    startBtn.classList.remove('hidden');

    if (!isLevelSelectionVisible()) {
        startBtn.disabled = false;
        if (btnText) btnText.textContent = 'Next';
        return;
    }

    if (!selectedLevel) {
        startBtn.classList.add('hidden');
        startBtn.disabled = true;
        return;
    }

    startBtn.disabled = false;
    if (btnText) btnText.textContent = 'Let\'s Go!';
}

function showLevelSelection() {
    const levelCard = document.getElementById('levelCard');
    if (!levelCard) return;
    startBtn.classList.add('hidden');
    levelCard.classList.remove('hidden');
    requestAnimationFrame(() => levelCard.classList.add('visible'));
    updateStartButtonState();
}

function hideLevelSelection() {
    const levelCard = document.getElementById('levelCard');
    if (!levelCard) return;
    levelCard.classList.remove('visible');
    setTimeout(() => {
        if (!levelCard.classList.contains('visible')) {
            levelCard.classList.add('hidden');
        }
    }, 250);
}

function showOperationSelection() {
    const opCard = document.getElementById('operationCard');
    if (!opCard) return;
    opCard.classList.remove('hidden');
    requestAnimationFrame(() => opCard.classList.add('visible'));
    updateStartButtonState();
}

function hideOperationSelection() {
    const opCard = document.getElementById('operationCard');
    if (!opCard) return;
    opCard.classList.remove('visible');
    opCard.classList.add('hidden');
}

function startTimer() {
    stopTimer();
    const config = getLevelConfig(selectedLevel);
    timeRemaining = config.time;
    timerDisplay.textContent = `${timeRemaining}s`;
    timerInterval = setInterval(() => {
        timeRemaining -= 1;
        timerDisplay.textContent = `${timeRemaining}s`;
        if (timeRemaining <= 0) {
            stopTimer();
            questionPrompt.textContent = '⏰ Time is up!';
            handleWrongAnswer(true);
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function resetTimerDisplay() {
    timerDisplay.textContent = '0s';
}

function generateQuestion() {
    if (lives <= 0) {
        resetGame();
    }

    if (!selectedLevel) {
        questionPrompt.textContent = 'Pick a level first!';
        return;
    }

    playClickSound();

    const levelConfig = getLevelConfig(selectedLevel);
    const maxVal = levelConfig.max;

    let num1, num2, operatorSymbol, answer;
    let actualOp = selectedOperation;

    
    if (selectedOperation === 'random') {
        const ops = ['addition', 'subtraction', 'multiplication', 'division'];
        actualOp = ops[Math.floor(Math.random() * ops.length)];
    }

    switch (actualOp) {
        case 'addition':
            num1 = getRandomInt(0, 10);
            num2 = getRandomInt(0, 10);
            operatorSymbol = '+';
            answer = num1 + num2;
            break;

        case 'subtraction':
            num1 = getRandomInt(0, 10);
            num2 = getRandomInt(0, 10);
            
            if (num1 < num2) [num1, num2] = [num2, num1];
            operatorSymbol = '−';
            answer = num1 - num2;
            break;

        case 'multiplication':
            num1 = getRandomInt(0, 10);
            num2 = getRandomInt(0, 10);
            operatorSymbol = '×';
            answer = num1 * num2;
            break;

        case 'division':
            num2 = getRandomInt(1, maxVal);
            const maxQuotient = Math.max(1, Math.floor(maxVal / num2));
            const quotient = getRandomInt(1, maxQuotient);
            num1 = num2 * quotient;
            operatorSymbol = '÷';
            answer = quotient;
            break;

        default:
            num1 = 0; num2 = 0; operatorSymbol = '+'; answer = 0;
    }

    
    currentNum1 = num1;
    currentNum2 = num2;
    currentOperator = operatorSymbol;
    currentAnswer = answer;
    questionGenerated = true;

    
    num1Display.textContent = num1;
    num2Display.textContent = num2;
    opDisplay.textContent = operatorSymbol;
    answerInput.value = '';
    answerInput.classList.remove('shake');
    answerInput.focus();
    questionPrompt.textContent = 'Type your answer and tap Check! ✨';

    startTimer();

    
    checkBtn.disabled = false;
    hintBtn.disabled = false;

    
    questionCard.style.transform = 'scale(1.02)';
    setTimeout(() => { questionCard.style.transform = 'scale(1)'; }, 250);

    
    hintCard.style.display = 'none';
    hintOverlay.classList.remove('active');

    
    showReactionBuddy('🤔');
}





function checkAnswer() {
    if (!questionGenerated) return;

    playClickSound();

    const userAnswer = parseInt(answerInput.value, 10);

    if (isNaN(userAnswer)) {
        answerInput.classList.add('shake');
        questionPrompt.textContent = 'Oops! Type a number first! 😊';
        showReactionBuddy('😅');
        setTimeout(() => answerInput.classList.remove('shake'), 500);
        return;
    }

    if (userAnswer === currentAnswer) {
        handleCorrectAnswer();
    } else {
        handleWrongAnswer();
    }
}

function handleCorrectAnswer() {
    score += 10;
    streak += 1;
    iq += 5;

    updateStatsDisplay();
    questionGenerated = false;

    playSuccessSound();
    launchConfetti();
    showReactionBuddy('🥳');

    questionPrompt.textContent = '✅ Correct! Nice work!';
    openAnswerModal({
        correct: true,
        title: 'Great job!',
        message: 'You got it right! Your IQ just jumped! Ready for the next one?'
    });
}

function handleWrongAnswer(timedOut = false) {
    lives -= 1;
    streak = 0;

    updateStatsDisplay();
    answerInput.classList.add('shake');
    setTimeout(() => answerInput.classList.remove('shake'), 500);

    questionGenerated = false;
    stopTimer();
    checkBtn.disabled = true;
    hintBtn.disabled = true;

    playErrorSound();
    showReactionBuddy('😢');

    if (lives <= 0) {
        playGameOverSound();
        questionPrompt.textContent = '💔 Game Over! Click Home to try again.';
        openAnswerModal({
            correct: false,
            title: 'Game Over',
            message: 'You ran out of lives. Tap Home to try again!'
        });
        return;
    }

    const timeoutMessage = timedOut ? 'Time ran out! ' : '';
    questionPrompt.textContent = `${timeoutMessage}Oops! Answer was ${currentAnswer}.`;
    openAnswerModal({
        correct: false,
        title: 'Oops!',
        message: `${timeoutMessage}The correct answer was ${currentAnswer}. Want to try another question?`
    });
}





function showHint() {
    if (!questionGenerated) return;

    playHintSound();

    const emojis = ['🍎', '🍪', '🌸', '⭐', '🐣', '🍓', '🧁', '🍕', '🎈', '💎'];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];

    let hintText = '';

    switch (currentOperator) {
        case '+':
            if (currentNum1 <= 10 && currentNum2 <= 10) {
                hintText = `${emoji.repeat(currentNum1)}\n+\n${emoji.repeat(currentNum2)}\n\nCount ALL the ${getEmojiName(emoji)}s together! 🔢`;
            } else {
                hintText = `Add ${currentNum1} and ${currentNum2} together!\n\nTry counting on your fingers! 🖐️`;
            }
            break;

        case '−':
            if (currentNum1 <= 10) {
                hintText = `${emoji.repeat(currentNum1)}\n\nTake away ${currentNum2}\n\nHow many ${getEmojiName(emoji)}s are left? 🤔`;
            } else {
                hintText = `Start with ${currentNum1} and take away ${currentNum2}.\n\nCount backwards! 🔙`;
            }
            break;

        case '×':
            if (currentNum1 <= 8 && currentNum2 <= 8) {
                const rows = [];
                for (let i = 0; i < currentNum2; i++) {
                    rows.push(emoji.repeat(currentNum1));
                }
                hintText = `${currentNum1} × ${currentNum2}\n\n${rows.join('\n')}\n\nThat's ${currentNum2} groups of ${currentNum1}! Count them all! 🔢`;
            } else {
                hintText = `${currentNum1} × ${currentNum2}\n\nThat means ${currentNum2} groups of ${currentNum1}.\nTry adding ${currentNum1} together ${currentNum2} times!`;
            }
            break;

        case '÷':
            if (currentNum1 <= 12 && currentNum2 <= 6 && currentNum2 > 0) {
                const perGroup = Math.floor(currentNum1 / currentNum2);
                const groups = [];
                for (let i = 0; i < currentNum2; i++) {
                    groups.push(emoji.repeat(perGroup));
                }
                hintText = `${currentNum1} ÷ ${currentNum2}\n\n${groups.join('   |   ')}\n\nSplit into ${currentNum2} equal groups. How many in each? 🤔`;
            } else {
                hintText = `${currentNum1} ÷ ${currentNum2}\n\nSplit ${currentNum1} into ${currentNum2} equal groups.\nHow many in each group?`;
            }
            break;
    }

    hintContent.textContent = hintText;
    hintOverlay.classList.add('active');
    hintCard.style.display = 'block';
    requestAnimationFrame(() => hintCard.classList.add('visible'));
}

function getEmojiName(emoji) {
    const names = {
        '🍎': 'apple', '🍪': 'cookie', '🌸': 'flower', '⭐': 'star',
        '🐣': 'chick', '🍓': 'strawberry', '🧁': 'cupcake', '🍕': 'pizza',
        '🎈': 'balloon', '💎': 'gem',
    };
    return names[emoji] || 'item';
}





function updateStatsDisplay() {
    scoreDisplay.textContent = score;
    streakDisplay.textContent = `x${streak}`;
    document.getElementById('iqDisplay').textContent = iq;

    let heartsHTML = '';
    for (let i = 0; i < 3; i++) {
        heartsHTML += i < lives ? '❤️' : '🖤';
    }
    livesDisplay.textContent = heartsHTML;

    
    if (streak > 0 && streak % 3 === 0) {
        streakDisplay.style.transform = 'scale(1.25)';
        setTimeout(() => { streakDisplay.style.transform = 'scale(1)'; }, 300);
    }
}





function resetGame() {
    score = 0;
    streak = 0;
    lives = 3;
    questionGenerated = false;
    currentNum1 = null;
    currentNum2 = null;
    currentOperator = null;
    currentAnswer = null;

    num1Display.textContent = '?';
    num2Display.textContent = '?';
    opDisplay.textContent = selectedOperation === 'random' ? '?' : getOperatorSymbol();
    answerInput.value = '';
    answerInput.classList.remove('shake');
    questionPrompt.textContent = 'Tap the magic wand to start! 🪄';
    checkBtn.disabled = true;
    hintBtn.disabled = true;
    hintCard.style.display = 'none';
    reactionBuddy.classList.remove('show');
    closeAnswerModal();
    stopTimer();
    resetTimerDisplay();

    updateStatsDisplay();
}

function openAnswerModal({ correct, title, message }) {
    stopTimer();
    resetTimerDisplay();
    modalIcon.textContent = correct ? '🥳' : '😬';
    modalTitle.textContent = title;
    modalEquation.textContent = `${currentNum1} ${currentOperator} ${currentNum2} = ${currentAnswer}`;
    modalMessage.textContent = message;
    modalScore.textContent = score;
    modalIQ.textContent = iq;

    answerModal.classList.add('active');
    answerModal.setAttribute('aria-hidden', 'false');
    answerInput.disabled = true;
    checkBtn.disabled = true;
    hintBtn.disabled = true;
}

function closeAnswerModal() {
    if (!answerModal) return;
    answerModal.classList.remove('active');
    answerModal.setAttribute('aria-hidden', 'true');
    answerInput.disabled = false;
    answerInput.focus();
}

function selectOperation(op, emoji, label, btn) {
    
    document.querySelectorAll('.operation-btn').forEach(b => b.classList.remove('selected'));
    
    document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('selected'));
    selectedLevel = null;
    hideLevelSelection();
    showOperationSelection();

    
    btn.classList.add('selected');
    selectedOperation = op;
    updateStartButtonState();

    playClickSound();
}

function selectLevel(level, btn) {
    document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedLevel = level;
    updateStartButtonState();
    playClickSound();
}

function goToGameScreen() {
    homeScreen.classList.remove('active');
    gameScreen.classList.add('active');

    
    hideLevelSelection();

    
    const opData = {
        addition: { emoji: '➕', label: 'Adding' },
        subtraction: { emoji: '➖', label: 'Subtracting' },
        multiplication: { emoji: '✖️', label: 'Multiplying' },
        division: { emoji: '➗', label: 'Dividing' },
        random: { emoji: '🎲', label: 'Surprise!' },
    };
    const data = opData[selectedOperation] || { emoji: '➕', label: 'Math' };
    currentOpEmoji.textContent = data.emoji;
    currentOpLabel.textContent = data.label;

    resetGame();
    opDisplay.textContent = getOperatorSymbol();
    generateQuestion();

    if (musicEnabled) {
        startMusic();
    }
}

function goToHomeScreen() {
    gameScreen.classList.remove('active');
    homeScreen.classList.add('active');
    selectedOperation = null;
    selectedLevel = null;
    document.querySelectorAll('.operation-btn').forEach(b => b.classList.remove('selected'));
    document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('selected'));
    hideLevelSelection();
    showOperationSelection();
    updateStartButtonState();

    if (musicEnabled) {
        startMusic();
    }
}






operationsGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('.operation-btn');
    if (!btn) return;
    const op = btn.dataset.op;
    const emoji = btn.dataset.emoji;
    const label = btn.dataset.label;
    selectOperation(op, emoji, label, btn);
});


startBtn.addEventListener('click', () => {
    if (!selectedOperation) return;
    if (!isLevelSelectionVisible()) {
        hideOperationSelection();
        showLevelSelection();
        return;
    }
    if (!selectedLevel) return;
    playClickSound();
    goToGameScreen();
});


levelGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('.level-btn');
    if (!btn) return;
    selectLevel(btn.dataset.level, btn);
});


generateBtn.addEventListener('click', generateQuestion);


checkBtn.addEventListener('click', checkAnswer);


hintBtn.addEventListener('click', showHint);

function closeHint() {
    playClickSound();
    hintCard.classList.remove('visible');
    hintOverlay.classList.remove('active');
    setTimeout(() => {
        hintCard.style.display = 'none';
    }, 260);
}


closeHintBtn.addEventListener('click', closeHint);
hintOverlay.addEventListener('click', closeHint);


modalNextBtn.addEventListener('click', () => {
    playClickSound();
    closeAnswerModal();
    generateQuestion();
});


backHomeBtn.addEventListener('click', () => {
    playClickSound();
    goToHomeScreen();
});


answerInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && questionGenerated) {
        e.preventDefault();
        checkAnswer();
    }
});


answerInput.addEventListener('input', () => {
    if (answerInput.value !== '' && isNaN(parseInt(answerInput.value, 10))) {
        answerInput.value = answerInput.value.replace(/[^0-9]/g, '');
    }
});


musicToggle.addEventListener('click', toggleMusic);





function init() {
    createBackgroundElements();
    updateStatsDisplay();
    opDisplay.textContent = '?';
    initMusic();

    
    const startMusicOnInteraction = () => {
        if (musicEnabled && musicCtx && musicCtx.state === 'suspended') {
            musicCtx.resume();
        }
        startMusic();
        document.removeEventListener('click', startMusicOnInteraction);
        document.removeEventListener('touchstart', startMusicOnInteraction);
    };
    document.addEventListener('click', startMusicOnInteraction);
    document.addEventListener('touchstart', startMusicOnInteraction);

    updateStartButtonState();
}

init();
