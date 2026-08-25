import { BASE_URL } from "../constants/api";

export async function getWorkers(params = {}) {
  try {
    const queryParams = new URLSearchParams();
    if (params.sort_by) queryParams.append("sort_by", params.sort_by);
    if (params.order) queryParams.append("order", params.order);
    if (params.limit !== undefined && params.limit !== null) queryParams.append("limit", params.limit);
    if (params.offset !== undefined && params.offset !== null) queryParams.append("offset", params.offset);
    if (params.page !== undefined && params.page !== null) queryParams.append("page", params.page);
    if (params.search) queryParams.append("search", params.search);
    if (params.skill) queryParams.append("skill", params.skill);

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
    const response = await fetch(`${BASE_URL}/public/workers/${queryString}`);
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
    const response = await fetch(`${BASE_URL}/public/workers/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch worker with ID ${id}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching worker with ID ${id}:`, error);
    throw error;
  }
}
