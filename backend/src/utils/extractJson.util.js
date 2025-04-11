// Function to extract JSON from a string
function extractJSON(inputString) {
  try {
    // Find where JSON might start (looking for the first '{')
    const startIdx = inputString.indexOf("{");
    if (startIdx === -1) {
      return { success: false, error: "No JSON object found in string" };
    }

    // Find where JSON might end (looking for the last '}')
    const endIdx = inputString.lastIndexOf("}") + 1;
    if (endIdx === 0) {
      return { success: false, error: "Invalid JSON: missing closing bracket" };
    }

    // Extract the potential JSON substring
    const jsonString = inputString.substring(startIdx, endIdx);

    // Try to parse the extracted string
    const parsedJSON = JSON.parse(jsonString);

    return {
      success: true,
      data: parsedJSON,
      rawJSON: jsonString,
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to parse JSON: ${error.message}`,
      partialExtraction: inputString.substring(
        inputString.indexOf("{"),
        inputString.lastIndexOf("}") + 1
      ),
    };
  }
}

module.exports = extractJSON;
