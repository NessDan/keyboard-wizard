// THIS NEEDS TO BE INCREMENTED IF wizardSettings STRUCTURE IS CHANGED AT ALL
const currentWizardVersion = "1";

export let wizardSettings;

export const saveWizardSettingsLocalStorage = () => {
  localStorage.setItem("wizardSettings", JSON.stringify(wizardSettings));
  localStorage.setItem("wizardSettingsVersion", currentWizardVersion);
};

export const loadWizardSettingsLocalStorage = () => {
  const existingConfig = localStorage.getItem("wizardSettings");
  const existingConfigVersion = localStorage.getItem("wizardSettingsVersion");

  // Version mismatch, breaking changes!
  if (existingConfig && existingConfigVersion !== currentWizardVersion) {
    alert(
      "Your saved configuration is from an older version of the site and there are breaking changes. Your settings have been erased."
    );

    eraseWizardSettingsLocalStorage();

    return;
  }

  return existingConfig;
};

export const eraseWizardSettingsLocalStorage = () => {
  // Erase the wizard settings from localStorage and the variable in memory
  localStorage.removeItem("wizardSettings");
  localStorage.removeItem("wizardSettingsVersion");
  location.reload();
};

export const resetWizardSettings = () => {
  wizardSettings = {
    leftStick: {
      up: "",
      down: "",
      left: "",
      right: "",
    },
    rightStick: {
      up: "",
      down: "",
      left: "",
      right: "",
    },
    buttons: {
      a: "",
      b: "",
      x: "",
      y: "",
    },
    triggers: {
      l: "",
      r: "",
      zl: "",
      zr: "",
    },
    dpad: {
      up: "",
      down: "",
      left: "",
      right: "",
    },
    system: {
      start: "",
      select: "",
      home: "",
      capture: "",
    },
    misc: {
      leftStickPress: "",
      rightStickPress: "",
      walk: "",
      walkSpeed: "",
    },
    socd: {
      leftRight: "",
      upDown: "",
    },
  };
};

export const initWizardSettings = () => {
  // Initialize the wizard settings
  const savedSettings = loadWizardSettingsLocalStorage();
  if (savedSettings) {
    wizardSettings = JSON.parse(savedSettings);
  } else {
    resetWizardSettings();
  }
};
