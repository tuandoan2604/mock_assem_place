/**
 * Create an config composed properties
 * @param integer min
 * @param integer max
 * @param integer value
 * @returns number
 */
const calcPercentPrice = (min, max, value) => {
  return (value - min) / (max - min);
};

/**
 * Create an config composed properties
 * @param float distance
 * @returns number
 */
const calcPercentLocation = (distance) => {
  if (distance < 0.1 && distance > 0.08) return 0.2;
  if (distance <= 0.08 && distance > 0.05) return 0.3;
  return 0.5;
};

module.exports = {
  calcPercentPrice,
  calcPercentLocation,
};
