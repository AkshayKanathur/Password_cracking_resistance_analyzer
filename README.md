# Password Cracking Resistance Analyzer

A web application to check the strength of a password.

## Features

* Checks if the password is in a common wordlist
* Checks basic security rules (length, uppercase, lowercase, numbers, special characters)
* Analyzes password strength using zxcvbn
* Checks if the password has been leaked in data breaches using Have I Been Pwned API

## Usage

1. Install dependencies: `npm install`
2. Start the server: `node server.js`
3. Open a web browser and navigate to `http://localhost:3000`
4. Enter a password in the input field and click the "Check Strength" button

## API Endpoint

* `POST /check-password`: Analyzes the password strength and returns a JSON response with the score, crack time, warnings, and suggestions.

## Dependencies

* `express`: Node.js web framework
* `cors`: Enables CORS support
* `body-parser`: Parses JSON requests
* `axios`: Makes HTTP requests to the Have I Been Pwned API
* `zxcvbn`: Analyzes password strength
* `fs`: Reads the common passwords file
* `path`: Resolves file paths

## Common Passwords File

The `passwords.txt` file contains a list of common passwords. You can update this file to include more passwords.

## Have I Been Pwned API

The application uses the Have I Been Pwned API to check if the password has been leaked in data breaches. You can find more information about the API at [https://haveibeenpwned.com/API](https://haveibeenpwned.com/API).
