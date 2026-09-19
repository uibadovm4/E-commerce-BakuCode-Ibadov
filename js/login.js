function loginUser() {
const loginForm = document.querySelector("form");


loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = {
        username: document.getElementById("user-username").value,
        password: document.getElementById("user-password").value
    };

    try {
        const response = await fetch(
            "http://195.26.245.5:9505/api/auth",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            }
        );

        const data = await response.json();

        if (response.ok) {

            const token = data.body?.token || data.response?.body?.token || data.respons?.body?.token || data.token || data.data?.token;
            if (!token) {
                throw new Error("Login response did not include a token.");
            }

            localStorage.setItem("response", JSON.stringify(data));
            localStorage.setItem("token", token);

            await Swal.fire({
                title: "Login was successful",
                text: "You can now explore the shop.",
                icon: "success",
                confirmButtonText: "Got it!"
            });

            loginForm.reset();

            window.location.href = "../index.html";

        } else {

            Swal.fire({
                title: "Login failed",
                text: data.message || "An error occurred during login.",
                icon: "error",
                confirmButtonText: "I understand!"
            });
        }

    } catch (error) {
        console.error("Login error:", error);

        Swal.fire({
            title: "Connection error",
            text: "Could not connect to the server.",
            icon: "error",
            confirmButtonText: "OK"
        });
    }
});


}

loginUser();