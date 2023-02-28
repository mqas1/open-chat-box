function setFormMessage(formElement, type, message) {
  const messageElement = formElement.querySelector(".form-message");

  messageElement.textContent = message;
  messageElement.classList.remove("form-message-success", "form-message-error");
  messageElement.classList.add(`form-message-${type}`);
}

function setInputError(inputElement, message) {
  inputElement.classList.add("form-input-error");
  inputElement.parentElement.querySelector(
    ".form-input-error-message"
  ).textContent = message;
}

function clearInputError(inputElement) {
    inputElement.classList.remove("form-input-error");
    inputElement.parentElement.querySelector(".form-input-error-message").textContent = "";
}

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("#login");
  const createAccountForm = document.querySelector("#createAccount");

  document
    .querySelector("#linkCreateAccount")
    .addEventListener("click", (e) => {
      e.preventDefault();
      loginForm.classList.add("hidden");
      createAccountForm.classList.remove("hidden");
    });

  document.querySelector("#linkLogin").addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.classList.remove("hidden");
    createAccountForm.classList.add("hidden");
  });

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    //Peform Fetch api Login

    setFormMessage(loginForm, "error", "Invalid Username or Password");
  });

  const submitButton = document.querySelector("#submit-button");
  document.querySelectorAll(".form-input").forEach((inputElement) => {
    inputElement.addEventListener("blur", (e) => {
      if (
        (e.target.id === "signupUsername" && e.target.value.length < 5) ||
        e.target.value.length > 15
      ) {
        setInputError(
          inputElement,
          "Username must be between 5 - 15 Characters in legth."
        );
        submitButton.disabled = true;
      } else {
        submitButton.disabled = false;
      }

      inputElement.addEventListener("input", e => {
        clearInputError(inputElement);
    });
    });

    
  });
});
