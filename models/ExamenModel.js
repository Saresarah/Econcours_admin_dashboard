const API_URL = "http://localhost:4000/api/admin";

export default class ExamenModel {

    static async createExamen(token, data) {
        const res = await fetch(`${API_URL}/examens`, {
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

    static async getAllExamens(token, params = {}) {

        const query = new URLSearchParams({
            draw: params.draw ?? 0,
            start: params.start ?? 0,
            length: params.length ?? 10,
            search: params.search ?? "",
            orderColumn: params.orderColumn ?? 0,
            orderDir: params.orderDir ?? "asc"
        });

        const url =
            `${API_URL}/examen/list-exam?${query.toString()}`;

        const res = await fetch(
            url,
            {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        const result = await res.json();

        return {
            ok: res.ok,
            data: result
        };
    }

    static async getDetailExamen(token, id_examen) {
        const res = await fetch(`${API_URL}/examens/${id_examen}`, {
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

    static async updateExamen(id_examen, token, data) {

        const res = await fetch(
            `${API_URL}/examens/${id_examen}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
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

    static async deleteExamen(id_examen, token) {

        const res = await fetch(
            `${API_URL}/examens/${id_examen}`,
            {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const result = await res.json();

        return {
            ok: res.ok,
            data: result
        };
    }

    static async getExamensByConcours(id_concours, token) {

        const res = await fetch(
            `${API_URL}/examens/concours/${id_concours}`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const result = await res.json();

        return {
            ok: res.ok,
            data: result
        };
    }

    static async exportExcel(token) {
        const res = await fetch(
            `${API_URL}/examens/export/excel`,
            {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        if (!res.ok) {
            const errorText = await res.text();

            console.error(
                "Erreur export Excel examens :",
                errorText
            );

            return {
                ok: false
            };
        }

        return {
            ok: true,
            blob: await res.blob()
        };
    }

    static async exportWord(token) {
        const res = await fetch(
            `${API_URL}/examens/export/word`,
            {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        if (!res.ok) {
            const errorText = await res.text();

            console.error(
                "Erreur export Word examens :",
                errorText
            );

            return {
                ok: false
            };
        }

        return {
            ok: true,
            blob: await res.blob()
        };
    }

    static async exportPDF(token) {
        const res = await fetch(
            `${API_URL}/examens/export/pdf`,
            {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        if (!res.ok) {
            const errorText = await res.text();

            console.error(
                "Erreur export PDF examens :",
                errorText
            );

            return {
                ok: false
            };
        }

        return {
            ok: true,
            blob: await res.blob()
        };
    }
}