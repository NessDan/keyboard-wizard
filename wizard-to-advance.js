const directionsToAdvanced = (
  wizardSettings,
  parentGroup,
  supportWalk,
  socdUpDown,
  socdLeftRight
) => {
  const allPossibleKeys = [
    wizardSettings[parentGroup].up,
    wizardSettings[parentGroup].down,
    wizardSettings[parentGroup].left,
    wizardSettings[parentGroup].right,
  ];

  if (supportWalk) {
    allPossibleKeys.push(wizardSettings.misc.walk);
  }

  const directionToAngle = {
    Up: 0,
    UpRight: 45,
    Right: 90,
    DownRight: 135,
    Down: 180,
    DownLeft: 225,
    Left: 270,
    UpLeft: 315,
    Neutral: 0,
  };

  const directionToDpad = {
    Up: 0,
    UpRight: 1,
    Right: 2,
    DownRight: 3,
    Down: 4,
    DownLeft: 5,
    Left: 6,
    UpLeft: 7,
    Neutral: 8,
  };

  const everyCombination = (keys) => {
    const combinations = [];
    for (let i = 0; i < keys.length; i++) {
      combinations.push([keys[i]]);
      for (let j = 0; j < keys.length; j++) {
        if (i === j) continue;

        combinations.push([keys[i], keys[j]]);
        for (let k = 0; k < keys.length; k++) {
          if (i === j || i === k) continue;
          if (j === k) continue;

          combinations.push([keys[i], keys[j], keys[k]]);
          for (let l = 0; l < keys.length; l++) {
            if (i === j || i === k || i === l) continue;
            if (j === k || j === l) continue;
            if (k === l) continue;

            combinations.push([keys[i], keys[j], keys[k], keys[l]]);
          }
        }
      }
    }
    return combinations;
  };

  const combinations = everyCombination(allPossibleKeys);

  const upDownLastPressedSocdInput = (keys) => {
    let upDown = "";
    keys.forEach((key) => {
      if (key === wizardSettings[parentGroup].up) upDown = "Up";
      if (key === wizardSettings[parentGroup].down) upDown = "Down";
    });
    return upDown;
  };

  const leftRightLastPressedSocdInput = (keys) => {
    let leftRight = "";
    keys.forEach((key) => {
      if (key === wizardSettings[parentGroup].left) leftRight = "Left";
      if (key === wizardSettings[parentGroup].right) leftRight = "Right";
    });
    return leftRight;
  };

  const leftRightNeutralSocdInput = (keys) => {
    let leftRight = "";

    if (
      keys.includes(wizardSettings[parentGroup].left) &&
      keys.includes(wizardSettings[parentGroup].right)
    ) {
      leftRight = "";
    } else if (keys.includes(wizardSettings[parentGroup].left)) {
      leftRight = "Left";
    } else if (keys.includes(wizardSettings[parentGroup].right)) {
      leftRight = "Right";
    }

    return leftRight;
  };

  const upDownNeutralSocdInput = (keys) => {
    let upDown = "";

    if (
      keys.includes(wizardSettings[parentGroup].up) &&
      keys.includes(wizardSettings[parentGroup].down)
    ) {
      upDown = "";
    } else if (keys.includes(wizardSettings[parentGroup].up)) {
      upDown = "Up";
    } else if (keys.includes(wizardSettings[parentGroup].down)) {
      upDown = "Down";
    }

    return upDown;
  };

  const leftRightPreferRightSocdInput = (keys) => {
    let leftRight = "";

    if (keys.includes(wizardSettings[parentGroup].right)) {
      leftRight = "Right";
    } else if (keys.includes(wizardSettings[parentGroup].left)) {
      leftRight = "Left";
    }

    return leftRight;
  };

  const leftRightPreferLeftSocdInput = (keys) => {
    let leftRight = "";

    if (keys.includes(wizardSettings[parentGroup].left)) {
      leftRight = "Left";
    } else if (keys.includes(wizardSettings[parentGroup].right)) {
      leftRight = "Right";
    }

    return leftRight;
  };

  const upDownPreferUpSocdInput = (keys) => {
    let upDown = "";

    if (keys.includes(wizardSettings[parentGroup].up)) {
      upDown = "Up";
    } else if (keys.includes(wizardSettings[parentGroup].down)) {
      upDown = "Down";
    }

    return upDown;
  };

  const upDownPreferDownSocdInput = (keys) => {
    let upDown = "";

    if (keys.includes(wizardSettings[parentGroup].down)) {
      upDown = "Down";
    } else if (keys.includes(wizardSettings[parentGroup].up)) {
      upDown = "Up";
    }

    return upDown;
  };

  const isWalking = (keys) => {
    if (!supportWalk) return false;
    if (keys.includes(wizardSettings.misc.walk)) {
      return true;
    }

    return false;
  };

  // Function used to tell which way a user is moving after key inputs
  const allKeyCombinationsToEdgeguardStructure = (combinations) => {
    const edgeguardConfig = [];

    combinations.forEach((combination) => {
      // Because the advanced editor does a system where
      // [['W', 'D']] -> ['W', 'D'] & ['D', 'W']
      // because it's shorter and easier to read as a human,
      // we need to do an explicit mapping for each key:
      // [['W'], ['D']] -> ['W', 'D']
      // We generated every possible combination above,
      // but we need to wrap each key in an array so that
      // the advanced editor can read it.
      const everyElWrappedInArrayCombination = combination.map((key) => [key]);
      let actionObject = {
        type: "lstick",
        angle: 0,
        stickDistance: 0,
      };

      switch (parentGroup) {
        case "rightStick":
          actionObject.type = "rstick";
          break;
        case "dpad":
          actionObject = {
            dpad: directionToDpad.Neutral,
            type: "dpad",
          };
          break;
        default:
          break;
      }
      const actionConfig = {
        keys: everyElWrappedInArrayCombination,
        action: actionObject,
      };

      const walking = isWalking(combination);
      let upDown = "";
      let leftRight = "";

      // If a user just presses walk alone, we can ignore it.
      if (combination.length === 1 && walking) {
        return;
      }

      switch (socdUpDown) {
        case "lastPressed":
          upDown = upDownLastPressedSocdInput(combination);
          break;
        case "neutral":
          upDown = upDownNeutralSocdInput(combination);
          break;
        case "preferUp":
          upDown = upDownPreferUpSocdInput(combination);
          break;
        case "preferDown":
          upDown = upDownPreferDownSocdInput(combination);
          break;
      }

      switch (socdLeftRight) {
        case "lastPressed":
          leftRight = leftRightLastPressedSocdInput(combination);
          break;
        case "neutral":
          leftRight = leftRightNeutralSocdInput(combination);
          break;
        case "preferLeft":
          leftRight = leftRightPreferLeftSocdInput(combination);
          break;
        case "preferRight":
          leftRight = leftRightPreferRightSocdInput(combination);
          break;
      }

      const direction = `${upDown}${leftRight}`;

      if (direction) {
        if (parentGroup === "dpad") {
          actionConfig.action.dpad = directionToDpad[direction];
        } else {
          actionConfig.action.angle = directionToAngle[direction];

          actionConfig.action.stickDistance = walking
            ? wizardSettings.misc.walkSpeed
            : 100;
        }
      }

      edgeguardConfig.push(actionConfig);
    });

    return edgeguardConfig;
  };

  const configsCompleted = allKeyCombinationsToEdgeguardStructure(combinations);

  return configsCompleted;
};
const buttonsToAdvanced = (wizardSettings) => {
  //   {
  //     "keys": [
  //       [
  //           "KeyD"
  //       ]
  //   ],
  //   "action": {
  //       "type": "button",
  //       "button": "A"
  //   }
  // }

  return [
    {
      keys: [[wizardSettings.buttons.a]],
      action: {
        type: "button",
        button: "A",
      },
    },
    {
      keys: [[wizardSettings.buttons.b]],
      action: {
        type: "button",
        button: "B",
      },
    },
    {
      keys: [[wizardSettings.buttons.x]],
      action: {
        type: "button",
        button: "X",
      },
    },
    {
      keys: [[wizardSettings.buttons.y]],
      action: {
        type: "button",
        button: "Y",
      },
    },
    {
      keys: [[wizardSettings.triggers.l]],
      action: {
        type: "button",
        button: "L",
      },
    },
    {
      keys: [[wizardSettings.triggers.r]],
      action: {
        type: "button",
        button: "R",
      },
    },
    {
      keys: [[wizardSettings.triggers.zl]],
      action: {
        type: "button",
        button: "ZL",
      },
    },
    {
      keys: [[wizardSettings.triggers.zr]],
      action: {
        type: "button",
        button: "ZR",
      },
    },
    {
      keys: [[wizardSettings.system.start]],
      action: {
        type: "button",
        button: "PLUS",
      },
    },
    {
      keys: [[wizardSettings.system.select]],
      action: {
        type: "button",
        button: "MINUS",
      },
    },
    {
      keys: [[wizardSettings.system.home]],
      action: {
        type: "button",
        button: "HOME",
      },
    },
    {
      keys: [[wizardSettings.system.capture]],
      action: {
        type: "button",
        button: "CAPTURE",
      },
    },
    {
      keys: [[wizardSettings.misc.leftStickPress]],
      action: {
        type: "button",
        button: "LCLICK",
      },
    },
    {
      keys: [[wizardSettings.misc.rightStickPress]],
      action: {
        type: "button",
        button: "RCLICK",
      },
    },
  ];
};

export const wizardToAdvanced = (wizardSettings) => {
  const leftStick = directionsToAdvanced(
    wizardSettings,
    "leftStick",
    true,
    wizardSettings.socd.upDown,
    wizardSettings.socd.leftRight
  );
  const dpad = directionsToAdvanced(
    wizardSettings,
    "dpad",
    false,
    "neutral",
    "neutral"
  );
  const rightStick = directionsToAdvanced(
    wizardSettings,
    "rightStick",
    false,
    "neutral",
    "neutral"
  );
  const buttons = buttonsToAdvanced(wizardSettings);
  const allConfigsCombined = [...buttons, ...leftStick, ...dpad, ...rightStick];
  console.log(buttons, leftStick, dpad, rightStick);

  return allConfigsCombined;
};
