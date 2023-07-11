export function hexToRgb1(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )}, 1)`
    : // ? {
      //     r: parseInt(result[1], 16),
      //     g: parseInt(result[2], 16),
      //     b: parseInt(result[3], 16),
      //   }
      null;
}

export function hexToRgb0(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )}, 0)`
    : // ? {
      //     r: parseInt(result[1], 16),
      //     g: parseInt(result[2], 16),
      //     b: parseInt(result[3], 16),
      //   }
      null;
}
