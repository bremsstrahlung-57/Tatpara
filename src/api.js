/**
 * API service for fetching data from the backend
 */

const API_BASE_URL = "https://tatpara.onrender.com";
/**
 * Fetches a motivational quote from the FastAPI backend
 * @returns {Promise<string>} A motivational quote
 */
export async function fetchMotivationalQuote() {
  try {
    const response = await fetch(`${API_BASE_URL}/motivation`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.quote;
  } catch (error) {
    console.error("Error fetching motivational quote:", error);
    return "The journey of a thousand miles begins with a single step.";
  }
}
