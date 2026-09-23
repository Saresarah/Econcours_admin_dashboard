
const API_URL = "http://localhost:4000/api/admin";

export default class AdminModel {

    static async login(data) {
        const res = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        return {
            ok: res.ok,
            data: result
        };
    }

    static async register(data) {
        const res = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        return {
            ok: res.ok,
            data: result
        };
    }

    static async getDashboard(token) {
        const res = await fetch(`${API_URL}/dashboard`, {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const result = await res.json();

        return {
            ok: res.ok,
            data: result
        };
    }

    static async getAllAdmins(token, params = {}) {

        const query = new URLSearchParams({
            draw: params.draw ?? 0,
            start: params.start ?? 0,
            length: params.length ?? 10,
            search: params.search ?? ""
        });

        const url =
            `${API_URL}/admin/get-all-admin?${query.toString()}`;

        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const result = await res.json();

        return {
            ok: res.ok,
            data: result
        };
    }

    static async registerAdmin(token, data) {

        const res = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        return {
            ok: res.ok,
            data: result
        };
    }

    static async deleteAdmin(token, id_admin) {

        const res = await fetch(
            `${API_URL}/admin/delete-admin/${id_admin}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const result = await res.json();

        return {
            ok: res.ok,
            data: result
        };
    }

    static async updateAdmin(token, id_admin, data) {

        const res = await fetch(
            `${API_URL}/admin/update-admin/${id_admin}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data)
            }
        );

        const result = await res.json();

        return {
            ok: res.ok,
            data: result
        };
    }

    static async getProfile(token) {

        const res = await fetch(
            `${API_URL}/admin/profile/${token}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const result = await res.json();

        return {
            ok: res.ok,
            data: result
        };
    }

    static async importExcel(token, type, file) {

        const formData = new FormData();

        formData.append("type", type);
        formData.append("file", file);

        // console.log("IMPORT EXCEL :", {
        //     type,
        //     fichier: file.name,
        //     format: file.type,
        //     taille: file.size
        // });

        const res = await fetch(`${API_URL}/create-client`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token
            },
            body: formData
        });

        const result = await res.json();

      //  console.log("RÉPONSE IMPORT :", result);

        return {
            ok: res.ok,
            data: result
        };
    }
}