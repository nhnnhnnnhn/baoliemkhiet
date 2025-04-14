require("dotenv").config();
const fs = require("fs");
const path = require("path");

// Read the initial prompt from file
const INITIAL_PROMPT = fs.readFileSync(
  path.join(__dirname, "./initial_prompt.txt"),
  "utf8"
);

/**
 * Makes a direct API call to Deepseek
 * @param {string} content - The content to send to Deepseek
 * @returns {Promise<string>} - The model's response
 */
async function deepseek(content) {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY not found in environment variables");
  }

  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [{ role: "user", content: INITIAL_PROMPT + content }],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `Deepseek API error: ${response.status} ${JSON.stringify(errorData)}`
    );
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

module.exports = {
  deepseek,
};
