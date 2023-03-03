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
          window.location.replace("/main");
        } else {
          setFormMessage(loginForm, "error", "Invalid username or password");
        }
      })
      .catch((err) => {
        console.log(err);
        setFormMessage(loginForm, "error", "Error logging in");
      });
  });

  createAccountForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const newUsername = document.querySelector("#signupUsername").value.trim();
    const newUserEmail = document.querySelector("#signupEmail").value.trim();
    const newUserPwd = document.querySelector("#signupConfirmPassword").value.trim();    

    fetch('/api/users', {
      method: "GET"
    })
    .then(function(response){
      return response.json(); 
    })
    .then(function(data) {
      if(!data){
        validNewUser(newUsername, newUserEmail, newUserPwd);
      } else {
        const validationData = data.map((user) => {
          return {
            user_name: user.user_name,
            email: user.email
          }
        });

        if (validationData.filter(x => x.user_name === newUsername).length > 0){
          setFormMessage(createAccountForm, "error", "Username already in use");
          return;
        } else if (validationData.filter(x => x.email === newUserEmail).length > 0) {
          setFormMessage(createAccountForm, "error", "Email already in use");
          return;
        } else {
          validNewUser(newUsername, newUserEmail, newUserPwd);
        }
      }
    })
    .catch((err) => {
      console.log(err);
      setFormMessage(createAccountForm, "error", "Error validating credentials");
    });
  });

  const validNewUser = (userName, email, password) => {
    fetch('/api/users', {
      method: "POST",
      body: JSON.stringify({
        user_name: userName,
        email: email,
        password: password
      }),
      headers: {
        "Content-type": "application/json"
      }
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        setFormMessage(createAccountForm, "success", "New user successfully created");
        window.location.replace("/main");
      } else {
        setFormMessage(createAccountForm, "error", "Unsuccessful in creating a new user account.");
      }
    })
    .catch((err) => {
      console.log(err);
      setFormMessage(createAccountForm, "error", "Error creating new user account");
    });
  }
 
  const submitButton = document.querySelector("#submit-button");
  document.querySelectorAll(".form-input").forEach((inputElement) => {
    inputElement.addEventListener("blur", (e) => {
      if (
        (e.target.id === "signupUsername" &&
          (e.target.value.length < 5 || e.target.value.length > 15 || invalidUserName(e.target.value))) ||
        (e.target.id === "signupEmail" && !isValidEmail(e.target.value)) ||
        (e.target.id === "signupPassword" && 
          (e.target.value.length < 8 || e.target.value.length > 20)) ||
        (e.target.id === "signupConfirmPassword" &&
          e.target.value !== document.querySelector("#signupPassword").value)
      ) {
        if (e.target.id === "signupUsername") {
          setInputError(
            inputElement,
            "Username must be between 5 - 15 characters in length without any spaces."
          );
        } else if (e.target.id === "signupEmail") {
          setInputError(inputElement, "Please enter a valid email address.");
        } else if (e.target.id === "signupPassword") {
          setInputError(
            inputElement,
            "Password must be between 8 - 20 characters in length."
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

  function invalidUserName(userName) {
  const userNameRegex = /[^\S]/g;
    return userNameRegex.test(userName);
  }
});
