const allPossibleKeys = ['Up', 'Down', 'Left', 'Right', 'Walk'];

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

// Takes `allPossibleKeys` and returns ["Up"], ["Up", "Down"], ["Up", "Down", "Left"], etc.
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

// User Settings
const leftRightSocd = 'neutral';
const upDownSocd = 'neutral';
const walkSpeed = 75;

// Global Variables

// Helper functions used for key direction depending on socd settings

const upDownLastPressedSocdInput = (keys) => {
  let upDown = '';
  keys.forEach((key) => {
    if (key === 'Up') upDown = 'Up';
    if (key === 'Down') upDown = 'Down';
  });
  return upDown;
};

const leftRightLastPressedSocdInput = (keys) => {
  let leftRight = '';
  keys.forEach((key) => {
    if (key === 'Left') leftRight = 'Left';
    if (key === 'Right') leftRight = 'Right';
  });
  return leftRight;
};

const leftRightNeutralSocdInput = (keys) => {
  let leftRight = '';

  if (keys.includes('Left') && keys.includes('Right')) {
    leftRight = '';
  } else if (keys.includes('Left')) {
    leftRight = 'Left';
  } else if (keys.includes('Right')) {
    leftRight = 'Right';
  }

  return leftRight;
};

const upDownNeutralSocdInput = (keys) => {
  let upDown = '';

  if (keys.includes('Up') && keys.includes('Down')) {
    upDown = '';
  } else if (keys.includes('Up')) {
    upDown = 'Up';
  } else if (keys.includes('Down')) {
    upDown = 'Down';
  }

  return upDown;
};

const leftRightPreferRightSocdInput = (keys) => {
  let leftRight = '';

  if (keys.includes('Right')) {
    leftRight = 'Right';
  } else if (keys.includes('Left')) {
    leftRight = 'Left';
  }

  return leftRight;
};

const leftRightPreferLeftSocdInput = (keys) => {
  let leftRight = '';

  if (keys.includes('Left')) {
    leftRight = 'Left';
  } else if (keys.includes('Right')) {
    leftRight = 'Right';
  }

  return leftRight;
};

const upDownPreferUpSocdInput = (keys) => {
  let upDown = '';

  if (keys.includes('Up')) {
    upDown = 'Up';
  } else if (keys.includes('Down')) {
    upDown = 'Down';
  }

  return upDown;
};

const upDownPreferDownSocdInput = (keys) => {
  let upDown = '';

  if (keys.includes('Down')) {
    upDown = 'Down';
  } else if (keys.includes('Up')) {
    upDown = 'Up';
  }

  return upDown;
};

// is the user currently pressing the walk key
const isWalking = (keys) => {
  if (keys.includes('Walk')) {
    return true;
  }

  return false;
};

// Function used to tell which way a user is moving after key inputs

const allKeyCombinationsToEdgeguardStructure = (combinations) => {
  const edgeguardConfig = [];

  combinations.forEach((combination) => {
    const actionConfig = {
      keys: combination,
      action: {
        type: 'lstick',
        angle: 0,
        stickDistance: 0,
      },
    };

    const walking = isWalking(combination);
    let upDown = '';
    let leftRight = '';

    // If a user just presses walk alone, we can ignore it.
    if (combination.length === 1 && walking) {
      return;
    }

    switch (upDownSocd) {
      case 'lastPressed':
        upDown = upDownLastPressedSocdInput(combination);
        break;
      case 'neutral':
        upDown = upDownNeutralSocdInput(combination);
        break;
      case 'preferUp':
        upDown = upDownPreferUpSocdInput(combination);
        break;
      case 'preferDown':
        upDown = upDownPreferDownSocdInput(combination);
        break;
    }

    switch (leftRightSocd) {
      case 'lastPressed':
        leftRight = leftRightLastPressedSocdInput(combination);
        break;
      case 'neutral':
        leftRight = leftRightNeutralSocdInput(combination);
        break;
      case 'preferLeft':
        leftRight = leftRightPreferLeftSocdInput(combination);
        break;
      case 'preferRight':
        leftRight = leftRightPreferRightSocdInput(combination);
        break;
    }

    const direction = `${upDown}${leftRight}`;

    if (direction === '') {
      actionConfig.action.angle = directionToAngle.Neutral;
      actionConfig.action.stickDistance = 0;
    } else {
      actionConfig.action.angle = directionToAngle[direction];

      actionConfig.action.stickDistance = walking ? walkSpeed : 100;
    }

    edgeguardConfig.push(actionConfig);

    console.log(actionConfig);
    console.log(',');
  });

  return edgeguardConfig;
};

const configsCompleted = allKeyCombinationsToEdgeguardStructure(combinations);
// console.log(configsCompleted);
