camelCase();
strings();

function camelCase() {
  let res = 0;
  const validVariable = 1;
  let not_valid_variable = 2; // nowValidVariable

  res = validVariable + not_valid_variable;

  return res;
}

function strings() {
  const notAllowed = "string";
  const alsoNotAllowed = 'string';
  const allGood = `all good`;
  let strings = notAllowed + alsoNotAllowed + allGood; //White space in comments
      strings = `This still works: ${notAllowed} ${alsoNotAllowed} ${allGood}` // Missing semicolon

  return strings;
}


function loops() { // Whitespace before brackets
  let res = 0;
  for(let i = 0; i < 10; i++) res += i;
 
  return res;
}

// New line in the end required?