
window.onload = console.log(`We're in`);

function showConcept(concept) {
  const conceptSpace = document.getElementById(`concept`);
  conceptSpace.innerText = concept;
}

function showDefinition(definition) {
  // image to display
  const definitionSpace = document.getElementById(`def`);

  // button to be pressed
  document.getElementById(`definition`).addEventListener(`click`, () => {
    definitionSpace.innerText = definition;
  });
}

function displayFlashcards() {
  // get all flashcard data for section
  const flashcardData = [];
  let concept = ``;
  let definition = ``;
  let agree = true;
  let clicked = false;
  let counter = 0;

  document.getElementById(`showDef`).addEventListener(`click`, () => {
    clicked = true;
  });

  document.getElementById(`notAgree`).addEventListener(`click`, () => {
    agree = false;
  });

  for (let i = 0; i < flashcardData.length; i++) {
    concept = flashcardData[counter].concept;
    definition = flashcardData[counter].definition;

    showConcept(concept);

    if (clicked === true) {
      showDefinition(definition);
    }

    if (agree === true) {
      counter++;
    }
    else {
      // log i databasen for user

    }
  }
}
