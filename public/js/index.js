document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector("#login");
    const createAccountForm = document.querySelector("#createAccount");

    document.querySelector("#linkCreateAccount").addEventListener("click", (e) => {
        e.preventDefault();
        loginForm.classList.add("hidden")
        createAccountForm.classList.remove("hidden")
    })

    document.querySelector("#linkLogin").addEventListener("click", (e) => {
        e.preventDefault()
        loginForm.classList.remove("hidden")
        createAccountForm.classList.add("hidden")
    })
})

