import { steps } from "./wizard-steps.js";
import {
  wizardSettings,
  initWizardSettings,
  eraseWizardSettingsLocalStorage,
  saveWizardSettingsLocalStorage,
} from "./wizard-settings-manager.js";
import { wizardToAdvanced } from "./wizard-to-advance.js";
import { mappingsToBinary } from "./shared/hardware/web-to-hardware-config.js";
import { keyEventCodeToC } from "./shared/constants/enums.js";
import { CardGroupComponent } from "./components/cardGroup.js";
const instructionsEl = document.getElementById("directions");
const numberWrapperEl = document.getElementById("number-value-wrapper");
const multiWrapperEl = document.getElementById("multi-value-wrapper");
const numberInputEl = document.getElementById("number-value-input");
const numberLabel = document.querySelector("#number-input-value");
const inputEvent = new Event("input");
const currentStep = () => steps[wizardStep];

const renderInitialHTML = () => {
  const renderOrder = ["leftStick", "buttons", "triggers", "system", "rightStick", "dpad", "misc", "socd"];

  const groupHtml = renderOrder.reduce((acc, parentProp) => {
    if (wizardSettings[parentProp] === undefined) {
      console.error("Wizard settings is missing a parentProp", parentProp)
      return acc;
    }

    return acc + CardGroupComponent({
      parentProp,
      childProps: wizardSettings[parentProp],
    });
  }, "");

  document.getElementById("config-wrapper").innerHTML = groupHtml;
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
  if (currentStep().stepType === "message") {
    instructionsEl.innerText = currentStep().message;
  } else if (currentStep().keyToSet) {
    instructionsEl.innerText = `Press key for: ${currentStep().keyToSet}`;
  } else if (currentStep().valueToSet) {
    instructionsEl.innerText = `Set value for: ${currentStep().valueToSet}`;
  }
};

const updateKeyEl = (parentProp, prop) => {
  const keyEl = document.querySelector(`#${parentProp}-${prop}-value`);
  const keyCode = wizardSettings[parentProp][prop];
  const humanReadableKey = keyEventCodeToC[keyCode];
  keyEl.innerText = humanReadableKey ?? keyCode;
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
  const prevActiveCardEl = document.querySelector(".card.active");
  prevActiveCardEl?.classList?.remove("active");
  prevActiveCardEl?.ariaPressed ?? "false";
  nextActiveCardEl?.classList?.add("active");
  nextActiveCardEl?.ariaPressed ?? "true";
};

const convertMultiOptionsHtml = () => {
  const multiListEl = document.getElementById("multi-input-values");
  const htmlList = currentStep().options.reduce((acc, option) => {
    return acc + `<li id='multi-option-${option.value}'>${option.label}</li>`;
  }, "");
  multiListEl.innerHTML = htmlList;
};

const showOrHideInstructionsWrapper = () => {
  if (currentStep().stepType === "number") {
    numberWrapperEl.classList.remove("hidden");
  } else {
    numberWrapperEl.classList.add("hidden");
  }
  if (currentStep().stepType === "multi") {
    multiWrapperEl.classList.remove("hidden");
    convertMultiOptionsHtml();
  } else {
    multiWrapperEl.classList.add("hidden");
  }
};

const addErrorToCard = (parentProp, prop) => {
  const cardEl = document.querySelector(`#${parentProp}-${prop}-card`);
  cardEl.addEventListener("animationend", () => {
    cardEl?.classList?.remove("error");
  });
  cardEl.classList.add("error");
};

const removeAllCardErrors = () => {
  const errorCardEls = document.querySelectorAll(".card.error");
  errorCardEls.forEach((errorCardEl) => {
    errorCardEl.classList.remove("error");
  });
};

const updateAllEls = () => {
  updateInstructions();
  showOrHideInstructionsWrapper();
  updateAllKeyEls();
  updateActiveCard();
  removeAllCardErrors();
};

const setValueToCurrentStep = (value) => {
  const parentProp = currentStep().parentProp;
  const prop = currentStep().propertyToModify;
  wizardSettings[parentProp][prop] = value;
  wizardStep += 1;
  updateAllEls();
  saveWizardSettingsLocalStorage();
};

const multiValueKeyDownHandler = (event) => {
  // Grabs the last character of number codes 'Digit1' -> 1 Or 'Numpad1' -> 1
  // Then checks if the number is a valid option in our multiselect array
  if (event.code.startsWith("Digit") || event.code.startsWith("Numpad")) {
    const digit = Number(event.code.slice(-1));
    const option = currentStep().options[digit - 1];
    if (option) {
      setValueToCurrentStep(option.value);
    }
  }
};

const numberInputKeyDownHandler = (event) => {
  switch (event.code) {
    case "Enter":
      setValueToCurrentStep(numberInputEl.value);
      break;
    case "ArrowDown":
    case "ArrowLeft":
      numberInputEl.stepDown();
      numberInputEl.dispatchEvent(inputEvent);
      break;
    case "ArrowUp":
    case "ArrowRight":
      numberInputEl.stepUp();
      numberInputEl.dispatchEvent(inputEvent);
      break;
  }
};

const keyboardKeyDownHandler = (event) => {
  const [keyUsed, duplicateParentProp, duplicateProp] = whereIsKeyUsed(
    event.code
  );
  if (keyUsed) {
    addErrorToCard(duplicateParentProp, duplicateProp);
    return;
  }
  setValueToCurrentStep(event.code);
};

const keyDownRouter = (event) => {
  event.preventDefault();

  // last step should be success message
  if (wizardStep === steps.length - 1) {
    return;
  }
  if (currentStep().stepType === "number") {
    numberInputKeyDownHandler(event);
  } else if (currentStep().stepType === "multi") {
    multiValueKeyDownHandler(event);
  } else {
    keyboardKeyDownHandler(event);
  }
};

const cardClickHandler = (event) => {
  const cardEl = event.target.closest(".card");
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

const startWizard = () => {
  document.addEventListener("keydown", keyDownRouter);
  document.querySelectorAll(".card").forEach((cardEl) => {
    cardEl.addEventListener("click", cardClickHandler);
  });
  document.querySelector("#reset-button").addEventListener("click", () => {
    eraseWizardSettingsLocalStorage();
    updateAllEls();
  });
  document
    .querySelector("#save-to-adapter-button")
    .addEventListener("click", () => {
      const advancedVersion = wizardToAdvanced(wizardSettings);
      const binaryConfig = mappingsToBinary([
        { version: "1.0.0", configs: advancedVersion },
      ]);
      console.log(binaryConfig);
    });
  numberInputEl.addEventListener("input", () => {
    numberLabel.innerText = numberInputEl.value;
  });
  document.querySelector("#number-value-save").addEventListener("click", () => {
    setValueToCurrentStep(numberInputEl.value);
  });

  initWizardSettings();
  renderInitialHTML();
  updateAllEls();
};

startWizard();
