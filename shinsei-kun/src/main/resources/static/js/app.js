// 確認ダイアログの文言をそろえる。画面ごとの JS からも呼びます。
function confirmAction(actionName) {
  return window.confirm(actionName + "してよいですか？");
}

document.querySelectorAll("form.js-approve-confirm").forEach((form) => {
  form.addEventListener("submit", (event) => {
    if (!confirmAction("承認")) {
      event.preventDefault();
    }
  });
});
