import { BASE_URL } from "../constants/api";

export async function getWorkers() {
  try {
    const response = await fetch(`${BASE_URL}/workers`);
    if (!response.ok) {
      throw new Error("Failed to fetch worker data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching worker data:", error);
    throw error;
  }
}

export async function getWorkerById(id) {
  try {
    const response = await fetch(`${BASE_URL}/workers/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch worker with ID ${id}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching worker with ID ${id}:`, error);
    throw error;
  }
}
