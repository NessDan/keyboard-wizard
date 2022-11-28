const currentStep = () => steps[wizardStep];

const updateInstructions = () => {
  if (currentStep().message) {
    instructionsEl.innerText = currentStep().message;
  } else if (currentStep().message) {
    instructionsEl.innerText = `Press key for: ${currentStep().keyToSet}`;
  }
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
    objectReference: wizardSettings.leftStick,
    propertyToModify: 'up',
  },
  {
    keyToSet: 'Left Stick Down',
    objectReference: wizardSettings.leftStick,
    propertyToModify: 'down',
  },
  {
    message: "You're all set! Click the button below to save your settings.",
  },
];

console.log(wizardSettings);

document.addEventListener('keydown', (event) => {
  const prop = currentStep().propertyToModify;
  const wizardObject = currentStep().objectReference;
  wizardObject[prop] = event.code;
  wizardStep += 1;
  updateInstructions();
});

updateInstructions();
