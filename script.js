// ===== levels definition (starter: 3 levels) =====
const levels = [
  {
    id: 1,
    name: "Caesar Cipher",
    encrypted: "Khoor Zruog!",
    // correct answer (for simple equality check)
    decrypted: "Hello World!",
    hint: "Each letter shifted by 3 to the right. Reverse shift to decode."
  },
  {
    id: 2,
    name: "Atbash Cipher",
    encrypted: "Svool Dliow!",
    decrypted: "Hello World!",
    hint: "A↔Z mapping. Each letter maps to its reverse in alphabet."
  },
  {
    id: 3,
    name: "Morse Code",
    encrypted: ".... . .-.. .-.. ---  .-- --- .-. .-.. -..",
    decrypted: "HELLO WORLD",
    hint: "Dots and dashes separate letters. Use a space between letters and double-space between words."
  }
];

let currentIndex = Number(localStorage.getItem('dtm-level')) || 0; // index in array
if (currentIndex >= levels.length) currentIndex = 0;

const el = {
  cipherName: document.getElementById('cipher-name'),
  cipherText: document.getElementById('cipher-text'),
  userInput: document.getElementById('user-input'),
  submitBtn: document.getElementById('submit-btn'),
  hintBtn: document.getElementById('hint-btn'),
  skipBtn: document.getElementById('skip-btn'),
  result: document.getElementById('result'),
  levelIndicator: document.getElementById('level-indicator')
};

function normalizeAnswer(s){
  return s.replace(/\s+/g,' ').trim().toLowerCase();
}

function loadLevel(i){
  const level = levels[i];
  el.cipherName.textContent = level.name;
  el.cipherText.textContent = level.encrypted;
  el.userInput.value = '';
  el.result.textContent = '';
  el.levelIndicator.textContent = `Level ${level.id} / ${levels.length}`;
  localStorage.setItem('dtm-level', i);
}
loadLevel(currentIndex);

// ======= Cipher decoders (simple, for validation) =======

function caesarDecode(text, shift=3){
  const A = 'a'.charCodeAt(0);
  const Z = 'z'.charCodeAt(0);
  const Aup = 'A'.charCodeAt(0);
  const Zup = 'Z'.charCodeAt(0);
  return text.split('').map(ch=>{
    const code = ch.charCodeAt(0);
    if(code >= A && code <= Z){
      return String.fromCharCode(((code - A - shift + 26) % 26) + A);
    } else if(code >= Aup && code <= Zup){
      return String.fromCharCode(((code - Aup - shift + 26) % 26) + Aup);
    } else return ch;
  }).join('');
}

function atbashDecode(text){
  const low = 'abcdefghijklmnopqrstuvwxyz';
  const up = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return text.split('').map(ch=>{
    if(up.includes(ch)){
      return up[25 - up.indexOf(ch)];
    } else if(low.includes(ch)){
      return low[25 - low.indexOf(ch)];
    } else return ch;
  }).join('');
}

const MORSE = {
  '.-':'A','-...':'B','-.-.':'C','-..':'D','.':'E','..-.':'F','--.':'G','....':'H','..':'I',
  '.---':'J','-.-':'K','.-..':'L','--':'M','-.':'N','---':'O','.--.':'P','--.-':'Q','.-.':'R',
  '...':'S','-':'T','..-':'U','...-':'V','.--':'W','-..-':'X','-.--':'Y','--..':'Z',
  '-----':'0','.----':'1','..---':'2','...--':'3','....-':'4','.....':'5','-....':'6','--...':'7','---..':'8','----.':'9'
};

function morseDecode(text){
  // assume single space between letters, double-space between words
  return text.trim().split('  ').map(word=>{
    return word.split(' ').map(sym => MORSE[sym] || '?').join('');
  }).join(' ');
}

// Validate answer depending on level
function isCorrectAnswer(level, input){
  const normInput = normalizeAnswer(input);
  // permit either exact provided decrypted or programmatic decode in case user types decoded form
  if(level.name === 'Caesar Cipher'){
    const decodedByAlgo = caesarDecode(level.encrypted, 3);
    return normalizeAnswer(decodedByAlgo) === normInput || normalizeAnswer(level.decrypted) === normInput;
  } else if(level.name === 'Atbash Cipher'){
    const decodedByAlgo = atbashDecode(level.encrypted);
    return normalizeAnswer(decodedByAlgo) === normInput || normalizeAnswer(level.decrypted) === normInput;
  } else if(level.name === 'Morse Code'){
    const decoded = morseDecode(level.encrypted);
    return normalizeAnswer(decoded) === normInput || normalizeAnswer(level.decrypted) === normInput;
  }
  // fallback
  return normalizeAnswer(level.decrypted) === normInput;
}

// ====== UI events ======
el.submitBtn.addEventListener('click', ()=>{
  const level = levels[currentIndex];
  const guess = el.userInput.value || '';
  if(!guess.trim()){
    el.result.style.color = '#f0ad4e';
    el.result.textContent = 'Type something before submitting.';
    return;
  }
  if(isCorrectAnswer(level, guess)){
    el.result.style.color = '#23d18b';
    el.result.textContent = '✅ Correct! Loading next level...';
    setTimeout(()=> {
      currentIndex = (currentIndex + 1) % levels.length;
      loadLevel(currentIndex);
    }, 800);
  } else {
    el.result.style.color = '#ff6b6b';
    el.result.textContent = '❌ Not quite. Try again or use Hint.';
  }
});

el.hintBtn.addEventListener('click', ()=>{
  const level = levels[currentIndex];
  alert('Hint: ' + level.hint);
});

el.skipBtn.addEventListener('click', ()=>{
  if(confirm('Skip this level?')){
    currentIndex = (currentIndex + 1) % levels.length;
    loadLevel(currentIndex);
  }
});

// allow Enter key to submit
el.userInput.addEventListener('keydown', (e)=>{
  if(e.key === 'Enter') el.submitBtn.click();
});
