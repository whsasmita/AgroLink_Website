import { BASE_URL } from "../constants/api";

export async function getProducts() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/public/products/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return response.json();
}

export async function getProductsById(productId) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/public/products/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch product details");
  }
  return response.json();
}

// GET DETAIL PRODUCT DATA
export async function getProductsById(id) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authentication token not found.");
  }
  try {
    const response = await fetch(`${BASE_URL}/public/products/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch products");
    }
    return await response.json();
  } catch (error) {
    console.error("Error in getMyProducts service:", error);
    throw error;
  }
}

// GET MY PRODUCT DATA
export async function getMyProducts() {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authentication token not found.");
  }
  try {
    const response = await fetch(`${BASE_URL}/products/my`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        // "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = {
          message: `Request failed with status ${response.status}`,
        };
      }
      throw new Error(errorData.message || "Failed to fetch products");
    }
    return await response.json();
  } catch (error) {
    console.error("Error in getMyProducts service:", error);
    throw error;
  }
}

//CREATE PRODUCT DATA
export async function createProduct(data) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authentication token not found.");
  }
  try {
    const response = await fetch(`${BASE_URL}/products/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create product");
    }
    return await response.json();
  } catch (error) {
    console.error("Error in getMyProducts service:", error);
    throw error;
  }
}

// UPDATE PRODUCT DATA
export async function updateProduct(productId, data) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authentication token not found.");
  }
  try {
    const response = await fetch(`${BASE_URL}/products/${productId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update product");
    }
    return await response.json();
  } catch (error) {
    console.error("Error in getMyProducts service:", error);
    throw error;
  }
}

// DELETE PRODUCT DATA
export async function deleteProduct(productId) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authentication token not found.");
  }
  try {
    const response = await fetch(`${BASE_URL}/products/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: "Failed to delete product" };
      }
      throw new Error(errorData.message || "Failed to delete product");
    }

    if (response.status === 204) {
      return { message: "Product deleted successfully" };
    }

    return await response.json();
  } catch (error) {
    console.error("Error in getMyProducts service:", error);
    throw error;
  }
}
