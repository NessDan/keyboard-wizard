export let wizardSettings;

export const saveWizardSettings = () => {
  // Save the wizard settings to localStorage
  localStorage.setItem('wizardSettings', JSON.stringify(wizardSettings));
};

export const loadWizardSettings = () => {
  // Load the wizard settings from localStorage
  return localStorage.getItem('wizardSettings');
};

export const eraseWizardSettings = () => {
  // Erase the wizard settings from localStorage and the variable in memory
  localStorage.removeItem('wizardSettings');
  // resetWizardSettings(); // This is not needed because the wizard will be reloaded
  location.reload();
};

export const resetWizardSettings = () => {
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
      walk: '',
      walkSpeed: '',
    },
    socd: {
      leftRight: '',
      upDown: '',
    },
  };
};

export const initWizardSettings = () => {
  // Initialize the wizard settings
  const savedSettings = loadWizardSettings();
  if (savedSettings) {
    wizardSettings = JSON.parse(savedSettings);
  } else {
    resetWizardSettings();
  }
};
