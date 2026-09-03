document.querySelectorAll("form.js-submit-confirm").forEach((form) => {
  form.addEventListener("submit", (event) => {
    if (!confirmAction("提出")) {
      event.preventDefault();
    }
  });
});
