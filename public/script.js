async function checkPassword() {
    const password = document.getElementById("password").value;
    const result = document.getElementById("result");
    const warning = document.getElementById("warning");

    if (!password) {
        result.innerHTML = "⚠️ Please enter a password!";
        result.style.color = "red";
        return;
    }

    const response = await fetch("http://localhost:3000/check-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
    });

    const data = await response.json();

    // Set colors based on strength
    const colors = ["red", "orange", "#800080", "blue", "green"];
    result.style.color = colors[data.score];

    // Display results
    result.innerHTML = `🔹 Strength: ${data.score}/4 <br> ⏳ Crack Time: ${data.crackTime}`;

    // Display warnings
    if (data.warnings.length > 0 || data.suggestions.length > 0) {
        warning.innerHTML = "⚠️ " + [...data.warnings, ...data.suggestions].join("<br>");
        warning.style.color = "orange";
    } else {
        warning.innerHTML = "";
    }
}
