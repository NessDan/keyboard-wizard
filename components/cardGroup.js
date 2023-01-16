import { CardComponent } from "./card.js";

const cardGroupTitleLookup = {
  leftStick: "Left Stick",
  rightStick: "Right Stick",
  buttons: "Buttons",
  triggers: "Triggers",
  dpad: "D-Pad",
  system: "System",
  misc: "Misc.",
  socd: "SOCD",
};

export const CardGroupComponent = ({ parentProp, childProps }) => {
  const groupCardsHtml = Object.keys(childProps).reduce((acc, prop) => {
    return acc + CardComponent({ parentProp, prop });
  }, "");

  const title = cardGroupTitleLookup[parentProp];

  return `<div id="${parentProp}-group" class="config-group">
    <header class="config-group-header">${title}</header>
    <div class="card-holder">
      ${groupCardsHtml}
    </div>
    </div>`;
};
