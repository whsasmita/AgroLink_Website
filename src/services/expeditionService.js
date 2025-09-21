import { BASE_URL } from "../constants/api";

export async function getExpedition() {
  try {
    const response = await fetch(`${BASE_URL}/drivers/`);
    if (!response.ok) {
      throw new Error("Failed to fetch expedition data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching expedition data:", error);
    throw error;
  }
}

export async function getExpeditionById(id) {
  try {
    const response = await fetch(`${BASE_URL}/drivers/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch expedition with ID ${id}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching expedition with ID ${id}:`, error);
    throw error;
  }
}
