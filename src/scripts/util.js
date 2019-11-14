const getElem = selector => {
  return document.querySelector(selector) || null;
};

const log = val => {
  console.log(val);
};

export { getElem, log };
