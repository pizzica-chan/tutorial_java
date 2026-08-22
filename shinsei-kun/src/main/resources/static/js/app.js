document.querySelectorAll("form[action*='/approve']").forEach((form) => {
  form.addEventListener("submit", (event) => {
    if (!window.confirm("承認してよいですか？")) {
      event.preventDefault();
    }
  });
});
