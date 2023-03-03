export const getDialogBox = () => {
  const dialog = document.getElementById('dialog-box');
  return dialog;
};

export const openDialogBox = () => getDialogBox().show();

export const closeDialogBox = () => getDialogBox().close();

export const setBoxType = type => {
  getDialogBox().dataset.type = type;
};

export const alert = message => {
  // Set values
  getDialogBox().querySelector('#alert-message').innerText = message;

  // Activate box mode
  setBoxType('alert');
  openDialogBox();
};

const getConfirmClick = async () => {
  const confirmClose = getDialogBox().querySelector('#confirm-close');
  const confirmOkay = getDialogBox().querySelector('#confirm-ok');

  return new Promise(resolve => {
    confirmClose.addEventListener('click', () => {
      resolve(false);
    });
    confirmOkay.addEventListener('click', () => {
      resolve(true);
    });
  });
};

export const confirm = async message => {
  getDialogBox().querySelector('#confirm-message').innerText = message;
  setBoxType('confirm');
  openDialogBox();
  const clickResult = await getConfirmClick();
  return clickResult;
};

const getPromptInput = async () => {
  const input = getDialogBox().querySelector('#prompt-input');
  const close = getDialogBox().querySelector('#prompt-close');

  return new Promise(resolve => {
    close.addEventListener('click', () => {
      resolve(input.value);
    });
  });
};

export const prompt = async message => {
  getDialogBox().querySelector('#prompt-message').innerText = message;
  getDialogBox().querySelector('#prompt-input').value = '';
  setBoxType('prompt');
  openDialogBox();
  const promptResult = await getPromptInput();
  return promptResult;
};

const initializeDialog = () => {
  const alertClose = getDialogBox().querySelector('#alert-close');
  const confirmClose = getDialogBox().querySelector('#confirm-close');
  const confirmOkay = getDialogBox().querySelector('#confirm-ok');
  const promptClose = getDialogBox().querySelector('#prompt-close');

  alertClose.addEventListener('click', () => {
    closeDialogBox();
  });
  confirmClose.addEventListener('click', () => {
    closeDialogBox();
  });
  confirmOkay.addEventListener('click', () => {
    closeDialogBox();
  });
  promptClose.addEventListener('click', () => {
    closeDialogBox();
  });
};

initializeDialog();
