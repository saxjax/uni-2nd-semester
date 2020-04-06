
// Written using ES5 JS for browser support
window.addEventListener(`DOMContentLoaded`, () => {
  const form = document.querySelector(`form`);


  // Form elements
  const title = `Title`;
  let message = `Message`;
  const position = form.querySelector(`#position`).value;
  const duration = 3000;

  // Theme options
  // <option value="success">Success</option>
  // <option value="info">Information</option>
  // <option value="warning">Warning</option>
  // <option value="error">Error</option>
  // <option value="none">None</option>
  const theme = `success`;
  const closeOnClick = true;
  const displayClose = false;

  if (!message) {
    message = `You did not enter a message...`;
  }

  window.createNotification({
    closeOnClick,
    displayCloseButton: displayClose,
    positionClass: position,
    showDuration: duration,
    theme,
  })({
    title,
    message,
  });
});
