import * as dialog from './customdialog.js';

let value2 = '';

document.getElementById('alert-2').addEventListener('click', () => {
  dialog.alert('Front end is fun!');
});

document.getElementById('confirm-2').addEventListener('click', async () => {
  const confirmValue = 'I am taking CSE 134B.';
  const boolean = await dialog.confirm(confirmValue);
  document.getElementById(
    'output-tag-2'
  ).innerText = `The value returned by the confirm method is : ${boolean}`;
});

document.getElementById('prompt-2').addEventListener('click', async () => {
  value2 = await dialog.prompt('What is your first name?');
  if (!value2) {
    document.getElementById('output-tag-2').innerHTML = "The user didn't enter anything";
  } else {
    document.getElementById('output-tag-2').innerHTML = `The user entered ${value2}`;
  }
});
