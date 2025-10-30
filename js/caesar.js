// js/caesar.js

function caesarEncrypt(text, shift) {
  return text
    .split('')
    .map(char => {
      if (/[a-z]/.test(char)) {
        const code = (char.charCodeAt(0) - 97 + shift) % 26;
        return String.fromCharCode(code + 97);
      } else if (/[A-Z]/.test(char)) {
        const code = (char.charCodeAt(0) - 65 + shift) % 26;
        return String.fromCharCode(code + 65);
      }
      return char;
    })
    .join('');
}

function caesarDecrypt(text, shift) {
  return caesarEncrypt(text, 26 - shift);
}
