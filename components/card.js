const cardTitleLookup = {
  up: 'Up',
  down: 'Down',
  left: 'Left',
  right: 'Right',
  a: 'A',
  b: 'B',
  x: 'X',
  y: 'Y',
  l: 'L',
  r: 'R',
  zl: 'ZL',
  zr: 'ZR',
  start: 'Start',
  select: 'Select',
  home: 'Home',
  capture: 'Capture',
  leftStickPress: 'Left Stick Press',
  rightStickPress: 'Right Stick Press',
  walk: 'Walk',
  walkSpeed: 'Walk Speed',
  leftRight: 'Left/Right',
  upDown: 'Up/Down',
};


export const CardComponent = ({ parentProp, prop }) => {
  const cardTitle = cardTitleLookup[prop] || prop;

  return `
  <div
    class="card"
    id="${parentProp}-${prop}-card"
    role="button"
    aria-pressed="false"
    data-parentprop="${parentProp}"
    data-prop="${prop}"
  >
    <header class="card-header">${cardTitle}</header>
    <div class="card-body">
      <div class="value" id="${parentProp}-${prop}-value"></div>
    </div>
  </div>`;
};
