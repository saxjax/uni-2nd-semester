function showDefinitionTest() {
  // image to display
  const definitionSpace = document.getElementById(`def`);

  // button to be pressed
  document.getElementById(`definition`).addEventListener(`click`, () => {
    definitionSpace.src = `/img/Design/flashcard.png`;
  });
}


showDefinitionTest();
