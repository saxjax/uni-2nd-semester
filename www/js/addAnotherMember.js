/* eslint no-undef: 0 */

const membersContainer = document.getElementById(`membersContainer`);

createInputField(membersContainer, `Medlem`, 0);
document.getElementById(`addAnotherMemberBtn`).addEventListener(`click`, () => {
  createInputField(membersContainer, `Medlem`, 0);
});
