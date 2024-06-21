document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("loginForm"); // replace with your actual form ID
  
    loginForm.addEventListener("submit", async function(event) {
      event.preventDefault();
  
      const email = document.getElementById("email").value; // replace with your actual email input ID
      const password = document.getElementById("password").value; // replace with your actual password input ID
  
      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          // Successful login, store the token in sessionStorage
          sessionStorage.setItem("authToken", data.token);
          console.log("Login successful");
        } else {
          // Handle login error, display an error message, etc.
          console.error("Login failed:", data.error);
        }
      } catch (error) {
        console.error("Error during login:", error.message);
      }
    });
  });
  