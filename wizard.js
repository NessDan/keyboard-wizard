import { steps } from "./wizard-steps.js";
import {
  wizardSettings,
  initWizardSettings,
  eraseWizardSettingsLocalStorage,
  saveWizardSettingsLocalStorage,
} from "./wizard-settings-manager.js";
import { wizardToAdvanced } from "./wizard-to-advance.js";
import { mappingsToBinary } from "./shared/hardware/web-to-hardware-config.js";
import { CardGroupComponent } from "./components/cardGroup.js";
import { saveProfileToJSON } from "./shared/profiles/save.js";
import { getUserFriendlyText } from "./shared/constants/helpers.js";
const instructionsEl = document.getElementById("directions");
const numberWrapperEl = document.getElementById("number-value-wrapper");
const multiWrapperEl = document.getElementById("multi-value-wrapper");
const numberInputEl = document.getElementById("number-value-input");
const numberLabel = document.querySelector("#number-input-value");
const inputEvent = new Event("input");
const currentStep = () => steps[wizardStep];

const renderInitialHTML = () => {
  const renderOrder = [
    "leftStick",
    "buttons",
    "triggers",
    "system",
    "rightStick",
    "dpad",
    "misc",
    "socd",
  ];

  const groupHtml = renderOrder.reduce((acc, parentProp) => {
    if (wizardSettings[parentProp] === undefined) {
      console.error("Wizard settings is missing a parentProp", parentProp);
      return acc;
    }

    return (
      acc +
      CardGroupComponent({
        parentProp,
        childProps: wizardSettings[parentProp],
      })
    );
  }, "");

  document
    .getElementById("config-wrapper")
    .insertAdjacentHTML("afterbegin", groupHtml);
};

const updateInstructions = () => {
  if (currentStep().stepType === "message") {
    instructionsEl.innerText = currentStep().message;
  } else if (currentStep().keyToSet) {
    instructionsEl.innerText = `Press key for: ${currentStep().keyToSet}`;
  } else if (currentStep().stepType === "multi") {
    const totalSteps = currentStep().options.length;
    instructionsEl.innerHTML = `<b>Press 1-${totalSteps}</b> to set: ${
      currentStep().valueToSet
    }`;
  } else if (currentStep().stepType === "number") {
    instructionsEl.innerHTML = `<b>Use Arrow Keys</b> to set: ${
      currentStep().valueToSet
    }`;
  }
};

const updateKeyEl = (parentProp, prop) => {
  const keyEl = document.querySelector(`#${parentProp}-${prop}-value`);
  const keyCode = wizardSettings[parentProp][prop];
  const humanReadableKey = getUserFriendlyText(keyCode);
  keyEl.innerText = humanReadableKey;
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

  if (prevActiveCardEl) {
    prevActiveCardEl.classList.remove("active");
    prevActiveCardEl.ariaPressed = "false";
  }

  if (nextActiveCardEl) {
    nextActiveCardEl.classList.add("active");
    nextActiveCardEl.ariaPressed = "true";
  }
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

const updateCardErrors = () => {
  removeAllCardErrors();

  const duplicates = [];

  // Loop through all values in wizardSettings and find all the duplicates
  Object.keys(wizardSettings).forEach((parentProp) => {
    // Skip SOCD
    if (parentProp === "socd") {
      return false;
    }

    Object.keys(wizardSettings[parentProp]).forEach((prop) => {
      const keyboardKey = wizardSettings[parentProp][prop];
      if (keyboardKey !== "") {
        const duplicate = Object.keys(wizardSettings).some(
          (otherParentProp) => {
            // Skip SOCD
            if (otherParentProp === "socd") {
              return false;
            }

            return Object.keys(wizardSettings[otherParentProp]).some(
              (otherProp) => {
                if (otherParentProp === parentProp && otherProp === prop) {
                  return false;
                }

                return (
                  wizardSettings[otherParentProp][otherProp] === keyboardKey
                );
              }
            );
          }
        );
        if (duplicate && !duplicates.includes(keyboardKey)) {
          duplicates.push(keyboardKey);
        }
      }
    });
  });

  // Loop over duplicates array and call addErrorToCard
  duplicates.forEach((duplicate) => {
    Object.keys(wizardSettings).forEach((parentProp) => {
      Object.keys(wizardSettings[parentProp]).forEach((prop) => {
        if (wizardSettings[parentProp][prop] === duplicate) {
          addErrorToCard(parentProp, prop);
        }
      });
    });
  });
};

const toggleSaveButtons = () => {
  // Loop through all the wizard settings and check if any are unset
  // If any are unset then disable the save button
  const saveButtonEls = [
    document.getElementById("deploy-config"),
    document.getElementById("save-to-file"),
  ];

  const isUnset = Object.keys(wizardSettings).some((parentProp) => {
    return Object.keys(wizardSettings[parentProp]).some((prop) => {
      return wizardSettings[parentProp][prop] === "";
    });
  });

  const hasErrors = document.querySelectorAll(".card.error").length > 0;

  const canSave = !isUnset && !hasErrors;

  if (canSave) {
    saveButtonEls.forEach((saveButtonEl) => {
      saveButtonEl.disabled = false;
    });
  } else {
    saveButtonEls.forEach((saveButtonEl) => {
      saveButtonEl.disabled = true;
    });
  }
};

const updateAllEls = () => {
  updateInstructions();
  showOrHideInstructionsWrapper();
  updateAllKeyEls();
  updateActiveCard();
  updateCardErrors();
  toggleSaveButtons();
};

const setValueToCurrentStep = (value) => {
  const parentProp = currentStep().parentProp;
  const prop = currentStep().propertyToModify;
  wizardSettings[parentProp][prop] = value;
  wizardStep += 1;
  updateAllEls();
  saveWizardSettingsLocalStorage();
};

const keyboardKeyDownHandler = (event) => {
  if (event.repeat) return;
  setValueToCurrentStep(event.code);
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

const keyDownRouter = (event) => {
  event.preventDefault();

  // last step should be success message
  if (wizardStep === steps.length - 1) return;
  if (!event.code) return; // Sometimes function keys return null event codes

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

const eventListenerSetup = () => {
  document.addEventListener("keydown", keyDownRouter);
  document.querySelectorAll(".card").forEach((cardEl) => {
    cardEl.addEventListener("click", cardClickHandler);
  });
  document.querySelector("#delete-config").addEventListener("click", () => {
    eraseWizardSettingsLocalStorage();
    updateAllEls();
  });
  document.querySelector("#save-to-file").addEventListener("click", () => {
    const advancedVersion = wizardToAdvanced(wizardSettings);
    const fullMappingStructure = [
      { version: "1.0.0", configs: advancedVersion },
    ];
    saveProfileToJSON(fullMappingStructure);
  });
  document.querySelector("#deploy-config").addEventListener("click", () => {
    const profileNumber =
      Number(document.querySelector("#profile-number")?.value) || 1;
    const advancedVersion = wizardToAdvanced(wizardSettings);
    const fullMappingStructure = [
      { version: "1.0.0", configs: advancedVersion },
    ];
    const binaryConfig = mappingsToBinary(fullMappingStructure, profileNumber);
    console.log(binaryConfig);
  });
  numberInputEl.addEventListener("input", () => {
    numberLabel.innerText = numberInputEl.value;
  });
  document.querySelector("#number-value-save").addEventListener("click", () => {
    setValueToCurrentStep(numberInputEl.value);
  });
};

const startWizard = () => {
  initWizardSettings();
  renderInitialHTML();
  eventListenerSetup();

  updateAllEls();
};

startWizard();
