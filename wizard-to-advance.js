export const wizardToAdvanced = (wizardSettings) => {
  const allPossibleKeys = [
    wizardSettings.leftStick.up,
    wizardSettings.leftStick.down,
    wizardSettings.leftStick.left,
    wizardSettings.leftStick.right,
    wizardSettings.misc.walk,
  ];

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
      if (key === wizardSettings.leftStick.up) upDown = "Up";
      if (key === wizardSettings.leftStick.down) upDown = "Down";
    });
    return upDown;
  };

  const leftRightLastPressedSocdInput = (keys) => {
    let leftRight = "";
    keys.forEach((key) => {
      if (key === wizardSettings.leftStick.left) leftRight = "Left";
      if (key === wizardSettings.leftStick.right) leftRight = "Right";
    });
    return leftRight;
  };

  const leftRightNeutralSocdInput = (keys) => {
    let leftRight = "";

    if (
      keys.includes(wizardSettings.leftStick.left) &&
      keys.includes(wizardSettings.leftStick.right)
    ) {
      leftRight = "";
    } else if (keys.includes(wizardSettings.leftStick.left)) {
      leftRight = "Left";
    } else if (keys.includes(wizardSettings.leftStick.right)) {
      leftRight = "Right";
    }

    return leftRight;
  };

  const upDownNeutralSocdInput = (keys) => {
    let upDown = "";

    if (
      keys.includes(wizardSettings.leftStick.up) &&
      keys.includes(wizardSettings.leftStick.down)
    ) {
      upDown = "";
    } else if (keys.includes(wizardSettings.leftStick.up)) {
      upDown = "Up";
    } else if (keys.includes(wizardSettings.leftStick.down)) {
      upDown = "Down";
    }

    return upDown;
  };

  const leftRightPreferRightSocdInput = (keys) => {
    let leftRight = "";

    if (keys.includes(wizardSettings.leftStick.right)) {
      leftRight = "Right";
    } else if (keys.includes(wizardSettings.leftStick.left)) {
      leftRight = "Left";
    }

    return leftRight;
  };

  const leftRightPreferLeftSocdInput = (keys) => {
    let leftRight = "";

    if (keys.includes(wizardSettings.leftStick.left)) {
      leftRight = "Left";
    } else if (keys.includes(wizardSettings.leftStick.right)) {
      leftRight = "Right";
    }

    return leftRight;
  };

  const upDownPreferUpSocdInput = (keys) => {
    let upDown = "";

    if (keys.includes(wizardSettings.leftStick.up)) {
      upDown = "Up";
    } else if (keys.includes(wizardSettings.leftStick.down)) {
      upDown = "Down";
    }

    return upDown;
  };

  const upDownPreferDownSocdInput = (keys) => {
    let upDown = "";

    if (keys.includes(wizardSettings.leftStick.down)) {
      upDown = "Down";
    } else if (keys.includes(wizardSettings.leftStick.up)) {
      upDown = "Up";
    }

    return upDown;
  };

  const isWalking = (keys) => {
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

      const actionConfig = {
        keys: everyElWrappedInArrayCombination,
        action: {
          type: "lstick",
          angle: 0,
          stickDistance: 0,
        },
      };

      const walking = isWalking(combination);
      let upDown = "";
      let leftRight = "";

      // If a user just presses walk alone, we can ignore it.
      if (combination.length === 1 && walking) {
        return;
      }

      switch (wizardSettings.socd.upDown) {
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

      switch (wizardSettings.socd.leftRight) {
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

      if (direction === "") {
        actionConfig.action.angle = directionToAngle.Neutral;
        actionConfig.action.stickDistance = 0;
      } else {
        actionConfig.action.angle = directionToAngle[direction];

        actionConfig.action.stickDistance = walking
          ? wizardSettings.misc.walkSpeed
          : 100;
      }

      edgeguardConfig.push(actionConfig);
    });

    return edgeguardConfig;
  };

  const configsCompleted = allKeyCombinationsToEdgeguardStructure(combinations);

  return configsCompleted;
};