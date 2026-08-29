// 教材用。id="csrfToken" は一覧 HTML に無い。
document.querySelectorAll("form[action*='/approve']").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const tokenEl = document.getElementById("csrfToken");
    const token = tokenEl.value;
    const csrfInput = form.querySelector("input[name='_csrf']");
    csrfInput.value = token;
    form.submit();
  });
});
