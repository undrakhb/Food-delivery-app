const isNumberBetween = (value, min, max) =>
  typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;

export const isValidLocation = (location) =>
  isNumberBetween(location?.lat, -90, 90) &&
  isNumberBetween(location?.lng, -180, 180);
