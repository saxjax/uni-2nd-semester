async function  DeleteSection(sectionID) {
  const r = confirm(`Are you sure you want to delete this section? \nIt will also delete related evaluations.`);
  if (r === true) {
    const response = await fetch(`/delete/evaluation/section/${sectionID}`, {
      method: `DELETE`,
      headers: { "Content-Type": `application/json` },
    });
    const responseJSON = await response.json();
    if (responseJSON.response !== `OK`) {
      alert(`SOMETHING WENT SUPER WRONG!`);
    }
    else {
      alert(`Delete sucessfull`);
      window.location.reload();
    }
  }
  else {
    console.log(`You pressed Cancel!`);
  }
}
