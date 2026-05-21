(function () {
  window.IntroGen = window.IntroGen || {};

  function createToastApi(toastEl) {
    let toastTimer = null;

    function showToast(message) {
      toastEl.textContent = message;
      toastEl.classList.add("show");
      if (toastTimer) window.clearTimeout(toastTimer);
      toastTimer = window.setTimeout(() => toastEl.classList.remove("show"), 1400);
    }

    return { showToast };
  }

  window.IntroGen.toast = { createToastApi };
})();

