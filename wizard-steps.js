const steps = [
  {
    keyToSet: "Left Stick Up",
    parentProp: "leftStick",
    propertyToModify: "up",
  },
  {
    keyToSet: "Left Stick Down",
    parentProp: "leftStick",
    propertyToModify: "down",
  },
  {
    keyToSet: "Left Stick Left",
    parentProp: "leftStick",
    propertyToModify: "left",
  },
  {
    keyToSet: "Left Stick Right",
    parentProp: "leftStick",
    propertyToModify: "right",
  },
  {
    keyToSet: "A Button",
    parentProp: "buttons",
    propertyToModify: "a",
  },
  {
    keyToSet: "B Button",
    parentProp: "buttons",
    propertyToModify: "b",
  },
  {
    keyToSet: "X Button",
    parentProp: "buttons",
    propertyToModify: "x",
  },
  {
    keyToSet: "Y Button",
    parentProp: "buttons",
    propertyToModify: "y",
  },
  {
    keyToSet: "Left Trigger",
    parentProp: "triggers",
    propertyToModify: "l",
  },
  {
    keyToSet: "Right Trigger",
    parentProp: "triggers",
    propertyToModify: "r",
  },
  {
    keyToSet: "ZL Trigger",
    parentProp: "triggers",
    propertyToModify: "zl",
  },
  {
    keyToSet: "ZR Trigger",
    parentProp: "triggers",
    propertyToModify: "zr",
  },
  {
    keyToSet: "Start/+ Button",
    parentProp: "system",
    propertyToModify: "start",
  },
  {
    keyToSet: "Select/- Button",
    parentProp: "system",
    propertyToModify: "select",
  },
  {
    keyToSet: "Home Button",
    parentProp: "system",
    propertyToModify: "home",
  },
  {
    keyToSet: "Capture Button",
    parentProp: "system",
    propertyToModify: "capture",
  },

  {
    keyToSet: "Right Stick Up",
    parentProp: "rightStick",
    propertyToModify: "up",
  },
  {
    keyToSet: "Right Stick Down",
    parentProp: "rightStick",
    propertyToModify: "down",
  },
  {
    keyToSet: "Right Stick Left",
    parentProp: "rightStick",
    propertyToModify: "left",
  },
  {
    keyToSet: "Right Stick Right",
    parentProp: "rightStick",
    propertyToModify: "right",
  },
  {
    keyToSet: "DPad Up",
    parentProp: "dpad",
    propertyToModify: "up",
  },
  {
    keyToSet: "DPad Down",
    parentProp: "dpad",
    propertyToModify: "down",
  },
  {
    keyToSet: "DPad Left",
    parentProp: "dpad",
    propertyToModify: "left",
  },
  {
    keyToSet: "DPad Right",
    parentProp: "dpad",
    propertyToModify: "right",
  },
  {
    keyToSet: "Left Stick Press",
    parentProp: "misc",
    propertyToModify: "leftStickPress",
  },
  {
    keyToSet: "Right Stick Press",
    parentProp: "misc",
    propertyToModify: "rightStickPress",
  },
  {
    keyToSet: "Walk",
    parentProp: "misc",
    propertyToModify: "walk",
  },
  {
    valueToSet: "Walk Speed",
    parentProp: "misc",
    propertyToModify: "walkSpeed",
    stepType: "number",
  },
  {
    valueToSet: "Left-Right SOCD",
    parentProp: "socd",
    propertyToModify: "leftRight",
    stepType: "multi",
    options: [
      { value: "neutral", label: "Neutral - Legal at all tournaments" },
      {
        value: "lastInput",
        label: "Last Input - fastest, Legal at most tournaments",
      },
      { value: "absoluteLeft", label: "Always prefer left" },
      { value: "absoluteRight", label: "Always prefer Right" },
    ],
  },
  {
    valueToSet: "Up-Down SOCD",
    parentProp: "socd",
    propertyToModify: "upDown",
    stepType: "multi",
    options: [
      { value: "neutral", label: "Neutral - Legal at all tournaments" },
      {
        value: "lastInput",
        label: "Last Input - fastest, Legal at most tournaments",
      },
      { value: "absoluteUp", label: "Always prefer Up" },
      { value: "absoluteDown", label: "Always prefer Down" },
    ],
  },

  {
    message: "You're all set! Click the button below to save your settings.",
    stepType: "message",
  },
];

export default steps;
