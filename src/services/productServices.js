import { BASE_URL } from "../constants/api";

// GET ALL PRODUCT DATA
export async function getProducts() {
    const token = localStorage.getItem("token");
    try{
        const response = await fetch(`${BASE_URL}/public/products/`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch products");
        }
        return await response.json();
    }catch(error){
        throw error;
    }
}


// GET DETAIL PRODUCT DATA
export async function getProductsById(id){
    const token = localStorage.getItem("token");
    try{
        const response = await fetch(`${BASE_URL}/public/products/${id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch products");
        }
        return await response.json();
    }catch(error){
        throw error;
    }
}


//CREATE PRODUCT DATA
export async function createProduct(data) {
    const token = localStorage.getItem("token");
    try{
        const response = await fetch(`${BASE_URL}/products/`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to create product");
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

// UPDATE PRODUCT DATA
export async function updateProduct(productId, data) {
    const token = localStorage.getItem("token");
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
        throw error;
    }
}

// DELETE PRODUCT DATA
export async function deleteProduct(productId) {
    const token = localStorage.getItem("token");
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
        throw error;
    }
}
