function convertArrayToSemicolonSeparatedString(arr) {
  let res = ``;
  for (let i = 0; i < arr.length; i++) {
    res += `${arr[i]};`;
  }
  return res.slice(0, -1); // Sletter det sidste semikolon
}

module.exports = convertArrayToSemicolonSeparatedString;
