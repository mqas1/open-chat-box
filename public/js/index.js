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
  inputElement.parentElement.querySelector(
    ".form-input-error-message"
  ).textContent = "";
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
  
    const username = document.querySelector('#userLogin').value.trim();
    const password = document.querySelector('#userPassword').value.trim();
  
    // perform Fetch API login
    console.log("user_name:", username);
    console.log("password:", password);
    

    fetch('/api/users/login', {
      method: "POST",
      body: JSON.stringify({
        user_name: username,
        password: password
      }),
      headers: {
        "Content-type": "application/json"
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setFormMessage(loginForm, "success", "Login successful");
          window.location.replace("/main")
        } else {
          setFormMessage(loginForm, "error", "Invalid username or password");
        }
      })
      .catch((err) => {
        console.log(err)
        setFormMessage(loginForm, "error", "Error logging in");
      });
  });

  const submitButton = document.querySelector("#submit-button");
  document.querySelectorAll(".form-input").forEach((inputElement) => {
    inputElement.addEventListener("blur", (e) => {
      if (
        (e.target.id === "signupUsername" &&
          (e.target.value.length < 5 || e.target.value.length > 15)) ||
        (e.target.id === "signupEmail" && !isValidEmail(e.target.value)) ||
        (e.target.id === "signupPassword" && e.target.value.length < 8) ||
        (e.target.id === "signupConfirmPassword" &&
          e.target.value !== document.querySelector("#signupPassword").value)
      ) {
        if (e.target.id === "signupUsername") {
          setInputError(
            inputElement,
            "Username must be between 5 - 15 characters in length."
          );
        } else if (e.target.id === "signupEmail") {
          setInputError(inputElement, "Please enter a valid email address.");
        } else if (e.target.id === "signupPassword") {
          setInputError(
            inputElement,
            "Password must be at least 8 characters in length."
          );
        } else {
          setInputError(inputElement, "Passwords do not match.");
        }
        submitButton.disabled = true;
      } else {
        submitButton.disabled = false;
      }

      inputElement.addEventListener("input", (e) => {
        clearInputError(inputElement);
      });
    });
  });

  function isValidEmail(email) {
    // Regular expression to match email format
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  }
});
