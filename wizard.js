const currentStep = () => steps[wizardStep];

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

const setActiveCard = () => {
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

const instructionsEl = document.getElementById('directions');

const wizardSettings = {
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

const keyDownHandler = (event) => {
  event.preventDefault();
  if (wizardStep === steps.length - 1) {
    return;
  }
  const parentProp = currentStep().parentProp;
  const prop = currentStep().propertyToModify;
  wizardSettings[parentProp][prop] = event.code;
  wizardStep += 1;
  setActiveCard();
  updateKeyEl(parentProp, prop);
  updateInstructions();
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
  setActiveCard();
  updateInstructions();
};

document.addEventListener('keydown', keyDownHandler);
setActiveCard();
updateInstructions();
updateAllKeyEls();
document.querySelectorAll('.card').forEach((cardEl) => {
  cardEl.addEventListener('click', cardClickHandler);
});
