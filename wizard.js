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
    message: 'Press Key for Left Stick Up',
    objectReference: wizardSettings.leftStick,
    propertyToModify: 'up',
  },
];

console.log(wizardSettings);

document.addEventListener('keydown', (event) => {
  const prop = steps[wizardStep].propertyToModify;
  const wizardObject = steps[wizardStep].objectReference;
  wizardObject[prop] = event.code;

  wizardStep += 1;
});
