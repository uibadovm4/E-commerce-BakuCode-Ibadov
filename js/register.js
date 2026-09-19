
function registerUser() {
    const registerForm = document.querySelector("form");

    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const user = {
            name: document.getElementById("user-name").value,
            surname: document.getElementById("user-surname").value,
            email: document.getElementById("user-email").value,
            username: document.getElementById("user-username").value,
            password: document.getElementById("user-password").value
        };

        fetch("http://195.26.245.5:9505/api/clients", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })
        .then(async response => {
            const data = await response.json();

            if (response.ok) {
                Swal.fire({
                    title: "Registration successful",
                    text: "You can now log in to your account.",
                    icon: "success",
                    confirmButtonText: "Got it!"
                }).then(() => {
                    window.location.href = "login.html";
                });

            } else {
                Swal.fire({
                    title: "Registration failed",
                    text: data.message || "An error occurred during registration.",
                    icon: "error",
                    confirmButtonText: "I understand!"
                });
            }
        })
        .catch(error => {
            console.error(error);

            Swal.fire({
                title: "Connection error",
                text: "Could not connect to the server.",
                icon: "error",
                confirmButtonText: "I understand!"
            });
        });
    });
}

registerUser();

if (localStorage.getItem("response")) {
    swal.fire({
        title: "Already logged in",
        text: "You are already logged in. You will be redirected to the home page.",
        icon: "info",
        confirmButtonText: "OK"
    }).then(() => {
        window.location.href = "../index.html";
    });
}