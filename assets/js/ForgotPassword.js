document.addEventListener("DOMContentLoaded", function () {
  const apiUrlSendOtp = "http://localhost:5000/api/web_forgot";
  const apiUrlVerifyOtp = "http://localhost:5000/api/web_verify ";

  // Function to send OTP
  async function sendOtp(email) {
    try {
      const response = await fetch(apiUrlSendOtp, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error sending OTP:", error);
      throw new Error("An error occurred while sending OTP. Please try again.");
    }
  }

  // Function to verify OTP
  async function verifyOtp(email, otp) {
    try {
      const response = await fetch(apiUrlVerifyOtp, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, resetPasswordOTP: otp }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error verifying OTP:", error);
      throw new Error(
        "An error occurred during OTP verification. Please try again."
      );
    }
  }

  // Handle forgot password form submission
  document
    .getElementById("forgotPasswordForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const submitButton = document.getElementById("submitButton");

      // Disable the button and change its text to "OTP Sending..."
      submitButton.disabled = true;
      submitButton.innerText = "OTP Sending...";


      try {
        const data = await sendOtp(email);
        document.getElementById("statusMessage").innerText = data.message;

        if (data.success) {
          window.location.href = "verify-otp.html";
        }
      } catch (error) {
        document.getElementById("statusMessage").innerText = error.message;
      }
      finally {
        submitButton.disabled = false;
        submitButton.innerText = "Send OTP";
      }
    });

  // Handle OTP verification button click
  document
    .getElementById("verifyOtpButton")
    .addEventListener("click", async function () {
      const otp = document.getElementById("otp").value;
      const email = document.getElementById("email").value;
      const verifyButton = document.getElementById("verifyOtpButton");

      verifyButton.disabled = true;
      verifyButton.innerText = "Verifying...";

      try {
        const data = await verifyOtp(email, otp);
        document.getElementById("otpStatusMessage").innerText = data.message;

        if (data.success) {
          alert("OTP verified successfully!");
          window.location.href = "reset-password.html";
        }
      } catch (error) {
        document.getElementById("otpStatusMessage").innerText = error.message;
      }
      finally {
        verifyButton.disabled = false;
        verifyButton.innerText = "Verify OTP";
      }
    });
});
