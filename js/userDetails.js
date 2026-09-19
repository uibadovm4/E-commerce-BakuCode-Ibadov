function getUserDetails() {
  const response = JSON.parse(localStorage.getItem("response"));

  if (!response || !response.body || !response.body.token) {
    Swal.fire({
      title: "Not logged in",
      text: "You need to log in to access this page.",
      icon: "warning",
      confirmButtonText: "Go to Login"
    }).then(() => {
      window.location.href = "../pages/login.html";
    });
    return;
  }

  const token = response.body.token;

  fetch("http://195.26.245.5:9505/api/clients/get-details", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("user-name").textContent = data.name;
      document.getElementById("user-surname").textContent = data.surname;
      document.getElementById("user-email").textContent = data.email;
      document.getElementById("user-username").textContent = data.username;
    })
    .catch((error) => console.error("Error:", error));

  document.getElementById("logout-btn").addEventListener("click", () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You can log in again later.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log out!"
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("response");
        Swal.fire({
          title: "Logged out!",
          text: "You have been logged out.",
          icon: "success"
        }).then(() => {
          window.location.reload();
        });
      }
    });
  });

  document.getElementById("my-products-btn").addEventListener("click", () => {
    swal.fire({
      title: "Redirecting",
      text: "You will be redirected to your products page.",
      icon: "info",
      confirmButtonText: "Continue"
    }).then(() => {
      window.location.href = "../pages/userProducts.html";
    });
  });
}

getUserDetails();