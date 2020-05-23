/* eslint no-unused-vars: 0 */
/* eslint no-undef: 0 */

/* Formål: Sender et request til serveren som sletter et afsnit.
*  Input : afsnitID, DokumentID
*  Output: N/A
*/
async function deleteSection(sectionID, documentID) {
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
      window.location.replace(`/view/sectionsAndEvaluations/document/${documentID}`);
    }
  }
}
