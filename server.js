const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const zxcvbn = require("zxcvbn");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Load common passwords into a Set for fast lookup
const commonPasswords = new Set(fs.readFileSync(path.join(__dirname, "passwords.txt"), "utf-8").split("\n").map(p => p.trim().toLowerCase()));

// Function to check Have I Been Pwned API
async function checkHIBP(password) {
    const crypto = require("crypto");
    const hash = crypto.createHash("sha1").update(password).digest("hex").toUpperCase();
    const prefix = hash.substring(0, 5);
    const suffix = hash.substring(5);

    try {
        const response = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`);
        const hashes = response.data.split("\n").map(line => line.split(":"));

        for (let [h, count] of hashes) {
            if (h === suffix) {
                return parseInt(count);
            }
        }
    } catch (error) {
        console.error("HIBP API Error:", error);
    }

    return 0;
}

// Password Strength API Endpoint
app.post("/check-password", async (req, res) => {
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ error: "Password is required" });
    }

    let warnings = [];

    // ✅ Check if password is in common wordlist
    if (commonPasswords.has(password.toLowerCase())) {
        warnings.push("⚠️ This password is in a common wordlist! Prone to dictionary attacks.");
    }

    // ✅ Check basic security rules
    if (password.length < 8) warnings.push("❌ Minimum 8 characters required.");
    if (!/[A-Z]/.test(password)) warnings.push("❌ Add at least one uppercase letter.");
    if (!/[a-z]/.test(password)) warnings.push("❌ Add at least one lowercase letter.");
    if (!/[0-9]/.test(password)) warnings.push("❌ Add at least one number.");
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) warnings.push("❌ Add at least one special character.");

    // ✅ Check password strength using zxcvbn
    let analysis = zxcvbn(password);
    let score = analysis.score;
    let crackTime = analysis.crack_times_display.offline_slow_hashing_1e4_per_second;
    let suggestions = analysis.feedback.suggestions;

    // ✅ Check if password is leaked
    let breachCount = await checkHIBP(password);
    if (breachCount > 0) {
        warnings.push(`⚠️ WARNING: This password has been leaked ${breachCount} times in data breaches!`);
    }

    res.json({
        score,
        crackTime,
        warnings,
        suggestions
    });
});

// Start the server
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
