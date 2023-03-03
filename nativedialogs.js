/* eslint-disable no-undef */
/* eslint-disable no-alert */

let value = '';

document.getElementById('alert').addEventListener('click', () => {
  window.alert('Front end is fun!');
});

document.getElementById('confirm').addEventListener('click', () => {
  const confirmValue = 'I am taking CSE 134B.';
  const boolean = window.confirm(confirmValue);
  document.getElementById(
    'output-tag'
  ).innerText = `The value returned by the confirm method is : ${boolean}`;
});

document.getElementById('prompt').addEventListener('click', () => {
  value = window.prompt('What is your name?');
  if (!value) {
    document.getElementById('output-tag').innerHTML = "The user didn't enter anything";
  } else {
    document.getElementById('output-tag').innerHTML = `The user entered ${value}`;
  }
});

document.getElementById('safer-prompt').addEventListener('click', () => {
  value = window.prompt('What is your name?');
  if (!value) {
    document.getElementById('output-tag').innerHTML = "The user didn't enter anything";
  } else {
    document.getElementById('output-tag').innerHTML = DOMPurify.sanitize`The user entered ${value}`;
  }
});
