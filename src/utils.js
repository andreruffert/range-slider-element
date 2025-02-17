const ARIA_ATTRIBUTES = {
  value: 'valuenow',
  min: 'valuemin',
  max: 'valuemax',
};

export function getPrescision(value = '') {
  const afterDecimal = String(value).split('.')[1];
  return afterDecimal ? afterDecimal.length : 0;
}

export function setAriaAttribute(element, name, value) {
  const attributeName = ARIA_ATTRIBUTES[name];
  if (!attributeName) return;
  element.setAttribute(`aria-${attributeName}`, value);
}
