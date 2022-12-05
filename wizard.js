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
  resetWizardSettings();
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
      leftStickClick: '',
      rightStickClick: '',
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
    message: "You're all set! Click the button below to save your settings.",
  },
];

const startWizard = () => {
  document.addEventListener('keydown', keyDownHandler);
  document.querySelectorAll('.card').forEach((cardEl) => {
    cardEl.addEventListener('click', cardClickHandler);
  });

  initWizardSettings();
  updateAllEls();
};

startWizard();
