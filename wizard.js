const instructionsEl = document.getElementById('directions');
const currentStep = () => steps[wizardStep];
let wizardSettings;

const saveWizardSettings = () => {
  // Save the wizard settings to localStorage
  localStorage.setItem('wizardSettings', JSON.stringify(wizardSettings));
};

const loadWizardSettings = () => {
  // Load the wizard settings from localStorage
  return localStorage.getItem('wizardSettings');
};

const eraseWizardSettings = () => {
  // Erase the wizard settings from localStorage and the variable in memory
  localStorage.removeItem('wizardSettings');
  // resetWizardSettings(); // This is not needed because the wizard will be reloaded
  location.reload();
};

const resetWizardSettings = () => {
  wizardSettings = {
    leftStick: {
      up: '',
      down: '',
      left: '',
      right: '',
    },
    rightStick: {
      up: '',
      down: '',
      left: '',
      right: '',
    },
    buttons: {
      a: '',
      b: '',
      x: '',
      y: '',
    },
    triggers: {
      l: '',
      r: '',
      zl: '',
      zr: '',
    },
    dpad: {
      up: '',
      down: '',
      left: '',
      right: '',
    },
    system: {
      start: '',
      select: '',
      home: '',
      capture: '',
    },
    misc: {
      leftStickPress: '',
      rightStickPress: '',
    },
  };
};

const initWizardSettings = () => {
  // Initialize the wizard settings
  const savedSettings = loadWizardSettings();
  if (savedSettings) {
    wizardSettings = JSON.parse(savedSettings);
  } else {
    resetWizardSettings();
  }
};

const whereIsKeyUsed = (keyboardKey) => {
  // Check if a key is already bound to a button
  let findParentProp, findProp;

  let keyUsed = Object.keys(wizardSettings).some((parentProp) => {
    return Object.keys(wizardSettings[parentProp]).some((prop) => {
      if (
        parentProp === currentStep().parentProp &&
        prop === currentStep().propertyToModify
      ) {
        // Checking if the key being checked is currently being set if true skip
        return false;
      }
      if (wizardSettings[parentProp][prop] === keyboardKey) {
        findParentProp = parentProp;
        findProp = prop;
        return true;
      }
    });
  });
  return [keyUsed, findParentProp, findProp];
};

const updateInstructions = () => {
  if (currentStep().message) {
    instructionsEl.innerText = currentStep().message;
  } else if (currentStep().keyToSet) {
    instructionsEl.innerText = `Press key for: ${currentStep().keyToSet}`;
  }
};

const updateKeyEl = (parentProp, prop) => {
  const keyEl = document.querySelector(`#${parentProp}-${prop}-key`);
  keyEl.innerText = wizardSettings[parentProp][prop];
};

const updateAllKeyEls = () => {
  Object.keys(wizardSettings).forEach((parentProp) => {
    Object.keys(wizardSettings[parentProp]).forEach((prop) => {
      updateKeyEl(parentProp, prop);
    });
  });
};

const updateActiveCard = () => {
  const parentProp = currentStep().parentProp;
  const prop = currentStep().propertyToModify;
  const nextActiveCardEl = document.querySelector(
    `#${parentProp}-${prop}-card`
  );
  const prevActiveCardEl = document.querySelector('.card.active');
  prevActiveCardEl?.classList?.remove('active');
  prevActiveCardEl?.ariaPressed ?? 'false';
  nextActiveCardEl?.classList?.add('active');
  nextActiveCardEl?.ariaPressed ?? 'true';
};

const addErrorToCard = (parentProp, prop) => {
  const cardEl = document.querySelector(`#${parentProp}-${prop}-card`);
  cardEl.addEventListener('animationend', () => {
    cardEl?.classList?.remove('error');
  });
  cardEl.classList.add('error');
};

const removeAllCardErrors = () => {
  const errorCardEls = document.querySelectorAll('.card.error');
  errorCardEls.forEach((errorCardEl) => {
    errorCardEl.classList.remove('error');
  });
};

const updateAllEls = () => {
  updateInstructions();
  updateAllKeyEls();
  updateActiveCard();
  removeAllCardErrors();
};

const keyDownHandler = (event) => {
  event.preventDefault();
  if (wizardStep === steps.length - 1) {
    return;
  }
  const [keyUsed, duplicateParentProp, duplicateProp] = whereIsKeyUsed(
    event.code
  );
  if (keyUsed) {
    addErrorToCard(duplicateParentProp, duplicateProp);
    return;
  }
  const parentProp = currentStep().parentProp;
  const prop = currentStep().propertyToModify;
  wizardSettings[parentProp][prop] = event.code;
  wizardStep += 1;
  updateAllEls();
  saveWizardSettings();
};

const cardClickHandler = (event) => {
  const cardEl = event.target.closest('.card');
  if (!cardEl) {
    return;
  }
  const parentProp = cardEl.dataset.parentprop;
  const prop = cardEl.dataset.prop;
  const step = steps.findIndex(
    (step) => step.parentProp === parentProp && step.propertyToModify === prop
  );
  if (step === -1) {
    return;
  }
  wizardStep = step;
  updateAllEls();
};

let wizardStep = 0;

const steps = [
  {
    keyToSet: 'Left Stick Up',
    parentProp: 'leftStick',
    propertyToModify: 'up',
  },
  {
    keyToSet: 'Left Stick Down',
    parentProp: 'leftStick',
    propertyToModify: 'down',
  },
  {
    keyToSet: 'Left Stick Left',
    parentProp: 'leftStick',
    propertyToModify: 'left',
  },
  {
    keyToSet: 'Left Stick Right',
    parentProp: 'leftStick',
    propertyToModify: 'right',
  },
  {
    keyToSet: 'A Button',
    parentProp: 'buttons',
    propertyToModify: 'a',
  },
  {
    keyToSet: 'B Button',
    parentProp: 'buttons',
    propertyToModify: 'b',
  },
  {
    keyToSet: 'X Button',
    parentProp: 'buttons',
    propertyToModify: 'x',
  },
  {
    keyToSet: 'Y Button',
    parentProp: 'buttons',
    propertyToModify: 'y',
  },
  {
    keyToSet: 'Left Trigger',
    parentProp: 'triggers',
    propertyToModify: 'l',
  },
  {
    keyToSet: 'Right Trigger',
    parentProp: 'triggers',
    propertyToModify: 'r',
  },
  {
    keyToSet: 'ZL Trigger',
    parentProp: 'triggers',
    propertyToModify: 'zl',
  },
  {
    keyToSet: 'ZR Trigger',
    parentProp: 'triggers',
    propertyToModify: 'zr',
  },
  {
    keyToSet: 'Start/+ Button',
    parentProp: 'system',
    propertyToModify: 'start',
  },
  {
    keyToSet: 'Select/- Button',
    parentProp: 'system',
    propertyToModify: 'select',
  },
  {
    keyToSet: 'Home Button',
    parentProp: 'system',
    propertyToModify: 'home',
  },
  {
    keyToSet: 'Capture Button',
    parentProp: 'system',
    propertyToModify: 'capture',
  },

  {
    keyToSet: 'Right Stick Up',
    parentProp: 'rightStick',
    propertyToModify: 'up',
  },
  {
    keyToSet: 'Right Stick Down',
    parentProp: 'rightStick',
    propertyToModify: 'down',
  },
  {
    keyToSet: 'Right Stick Left',
    parentProp: 'rightStick',
    propertyToModify: 'left',
  },
  {
    keyToSet: 'Right Stick Right',
    parentProp: 'rightStick',
    propertyToModify: 'right',
  },
  {
    keyToSet: 'DPad Up',
    parentProp: 'dpad',
    propertyToModify: 'up',
  },
  {
    keyToSet: 'DPad Down',
    parentProp: 'dpad',
    propertyToModify: 'down',
  },
  {
    keyToSet: 'DPad Left',
    parentProp: 'dpad',
    propertyToModify: 'left',
  },
  {
    keyToSet: 'DPad Right',
    parentProp: 'dpad',
    propertyToModify: 'right',
  },
  {
    keyToSet: 'Left Stick Press',
    parentProp: 'misc',
    propertyToModify: 'leftStickPress',
  },
  {
    keyToSet: 'Right Stick Press',
    parentProp: 'misc',
    propertyToModify: 'rightStickPress',
  },

  {
    message: "You're all set! Click the button below to save your settings.",
  },
];

const startWizard = () => {
  document.addEventListener('keydown', keyDownHandler);
  document.querySelectorAll('.card').forEach((cardEl) => {
    cardEl.addEventListener('click', cardClickHandler);
  });
  document.querySelector('#reset-button').addEventListener('click', () => {
    eraseWizardSettings();
    updateAllEls();
  });

  initWizardSettings();
  updateAllEls();
};

startWizard();
