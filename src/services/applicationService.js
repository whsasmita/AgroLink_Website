import { BASE_URL } from "../constants/api";

export async function getApplications(projectId) {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${BASE_URL}/projects/${projectId}/applications`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch applications");
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

export async function applyToProject(projectId, applicationData = {}) {
    const token = localStorage.getItem("token");
    
    if (!token) {
        throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");
    }

    try {
        const response = await fetch(`${BASE_URL}/projects/${projectId}/apply`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: applicationData.message || ""
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.message || 
                `HTTP ${response.status}: Gagal melamar proyek`
            );
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error in applyToProject:", error);
        
        if ((error && error.name === 'TypeError') || (error?.message && error.message.includes && error.message.includes('fetch'))) {
            throw new Error("Koneksi bermasalah. Periksa koneksi internet Anda.");
        }
        
        throw error;
    }
}

export async function acceptApplication(applicationId) {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${BASE_URL}/applications/${applicationId}/accept`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to accept application");
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

export async function directOffer(workerId, offerData) {
    const token = localStorage.getItem("token");
    
    if (!token) {
        throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");
    }

    try {
        const response = await fetch(`${BASE_URL}/workers/${workerId}/direct-offer`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: offerData.title,
                description: offerData.description,
                location: offerData.location,
                start_date: offerData.start_date,
                end_date: offerData.end_date,
                payment_rate: parseFloat(offerData.payment_rate)
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.message || 
                `HTTP ${response.status}: Gagal mengirim penawaran langsung`
            );
        }
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error in directOffer:", error);
        
        if ((error && error.name === 'TypeError') || (error?.message && error.message.includes && error.message.includes('fetch'))) {
            throw new Error("Koneksi bermasalah. Periksa koneksi internet Anda.");
        }
        
        throw error;
    }
}