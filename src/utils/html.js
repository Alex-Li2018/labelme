import { rgbaChangeAlpha, contrastColor } from './colors'

export const htmlEscape = string => {
  const matchHtmlRegExp = /["'&<>]/;
  const str = "" + string;
  const match = matchHtmlRegExp.exec(str);

  if (!match) {
    return str;
  }

  let escape;
  let html = "";
  let index = 0;
  let lastIndex = 0;

  for (index = match.index; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34: // "
        escape = "&quot;";
        break;
      case 38: // &
        escape = "&amp;";
        break;
      case 39: // '
        escape = "&#39;";
        break;
      case 60: // <
        escape = "&lt;";
        break;
      case 62: // >
        escape = "&gt;";
        break;
      default:
        continue;
    }

    if (lastIndex !== index) {
      html += str.substring(lastIndex, index);
    }

    lastIndex = index + 1;
    html += escape;
  }

  return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
};

const stateClass = {
  active: "__active",
  highlighted: "__highlighted",
  collapsed: "__collapsed",
  hidden: "__hidden",
  noLabel: "htx-no-label",
};

export const createSpanStylesheet = (document, identifier, color) => {
  const className = `.htx-highlight-${identifier}`;
  const variables = {
    color: `--background-color-${identifier}`,
    cursor: `--cursor-style-${identifier}`,
  };

  const classNames = {
    active: `${className}.${stateClass.active}`,
    highlighted: `${className}.${stateClass.highlighted}`,
  };

  const activeColorOpacity = 0.8;
  const toActiveColor = color => rgbaChangeAlpha(color, activeColorOpacity);

  const initialActiveColor = toActiveColor(color);

  document.documentElement.style.setProperty(variables.color, color);

  const rules = {
    [className]: `
      background-color: var(${variables.color});
      cursor: var(${variables.cursor}, pointer);
      border: 1px dashed transparent;
    `,
    [`${className}[data-label]::after`]: `
      padding: 2px 2px;
      font-size: 9.5px;
      font-weight: bold;
      font-family: Monaco;
      vertical-align: super;
      content: attr(data-label);
      line-height: 0;
    `,
    [classNames.active]: `
      color: ${contrastColor(initialActiveColor)};
      ${variables.color}: ${initialActiveColor}
    `,
    [classNames.highlighted]: `
      position: relative;
      border-color: rgb(0, 174, 255);
    `,
    [`${className}.${stateClass.hidden}`]: `
      border: none;
      background: none;
      padding: 0;
    `,
    [`${className}.${stateClass.hidden}::before`]: `
      display: none
    `,
    [`${className}.${stateClass.hidden}::after`]: `
      display: none
    `,
    [`${className}.${stateClass.noLabel}::after`]: `
      display: none
    `,
  };

  const styleTag = document.createElement("style");

  styleTag.type = "text/css";
  styleTag.id = `highlight-${identifier}`;
  document.head.appendChild(styleTag);

  const stylesheet = styleTag.sheet ?? styleTag.styleSheet;
  const supportInserion = !!stylesheet.insertRule;
  let lastRuleIndex = 0;

  for (const ruleName in rules) {
    if (!Object.prototype.hasOwnProperty.call(rules, ruleName)) continue;
    if (supportInserion) stylesheet.insertRule(`${ruleName} { ${rules[ruleName]} } `, lastRuleIndex++);
    else stylesheet.addRule(ruleName, rules);
  }

  /**
   * Set region color
   * @param {string} color
   */
  const setColor = color => {
    const newActiveColor = toActiveColor(color);
    const { style } = stylesheet.rules[2];

    document.documentElement.style.setProperty(variables.color, color);

    style.backgroundColor = newActiveColor;
    style.color = contrastColor(newActiveColor);
  };

  /**
   * Ser cursor style
   * @param {import("prettier").CursorOptions} cursor
   */
  const setCursor = cursor => {
    document.documentElement.style.setProperty(variables.cursor, cursor);
  };

  /**
   * Remove stylesheet
   */
  const remove = () => {
    styleTag.remove();
  };

  return {
    className: className.substr(1),
    state: stateClass,
    setColor,
    setCursor,
    remove,
  };
};
