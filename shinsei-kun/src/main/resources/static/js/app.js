document.querySelectorAll("form.js-approve-confirm").forEach((form) => {
  form.addEventListener("submit", (event) => {
    if (!window.confirm("承認してよいですか？")) {
      event.preventDefault();
    }
  });
});
