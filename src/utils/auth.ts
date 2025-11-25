document.addEventListener("DOMContentLoaded", () => {
  const signInButton = document.querySelector('button[aria-label="Sign In"]');
  const authModal = document.getElementById("auth-modal");
  const closeModalButton = document.getElementById("close-modal");

  if (signInButton && authModal && closeModalButton) {
    signInButton.addEventListener("click", () => {
      authModal.classList.remove("hidden");
    });

    closeModalButton.addEventListener("click", () => {
      authModal.classList.add("hidden");
    });

    window.addEventListener("click", (event) => {
      if (event.target === authModal) {
        authModal.classList.add("hidden");
      }
    });
  }
});