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

const whereIsKeyUsed = (key) => {
  // Check if a key is already bound to a button
  let findParentProp, findProp;

  let keyUsed = Object.keys(wizardSettings).some((parentProp) => {
    return Object.keys(wizardSettings[parentProp]).some((prop) => {
      if (wizardSettings[parentProp][prop] === key) {
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

const updateAllEls = () => {
  updateInstructions();
  updateAllKeyEls();
  updateActiveCard();
};

const keyDownHandler = (event) => {
  event.preventDefault();
  if (wizardStep === steps.length - 1) {
    return;
  }
  const [keyUsed, foundParentProp, foundProp] = whereIsKeyUsed(event.code);
  if (keyUsed) {
    // TODO: Show red on key that is already bound
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
