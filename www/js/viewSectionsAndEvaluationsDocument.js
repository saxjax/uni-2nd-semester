/* eslint no-unused-vars: 0 */
/* eslint no-undef: 0 */

/* Formål: Sender et request til serveren som sletter et afsnit.
*  Input : afsnitID, Div-containerID
*  Output: N/A
*/
async function deleteSection(sectionID, sectionContainerID) {
  const choice = confirm(`Er du sikker på at du vil slette dette afsnit? \nDenne handling vil også slette tilknyttede evalueringer.`); // eslint-disable-line no-restricted-globals
  if (choice === true) {
    const response = await fetch(`/delete/evaluation/section/${sectionID}`, {
      method: `DELETE`,
      headers: { "Content-Type": `application/json` },
    });
    const responseJSON = await response.json();
    if (responseJSON.error) {
      alert(responseJSON.error);
    }
    else {
      const sectionContainer = document.getElementById(sectionContainerID);
      const alertNotif = insertDomNode(`DIV`, sectionContainer.nextSibling, `Afsnit slettet`, [{ class: `alert` }, { class: `alert-danger` }]);
      alertNotif.role = `alert`;
      sectionContainer.remove();
    }
  }
}
