const API_URL = "http://localhost:4000/api/admin";

export default class InscriptionModel {

    static async inscrireConcours(token, data) {

        const res = await fetch(
            `${API_URL}/candidats/inscrire-concours`,
            {
                method: "POST",
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

    static async getAllInscriptions(token, params = {}) {

        const query = new URLSearchParams({
            draw: params.draw ?? 0,
            start: params.start ?? 0,
            length: params.length ?? 10,
            search: params.search ?? "",
            orderColumn: params.orderColumn ?? 0,
            orderDir: params.orderDir ?? "asc"
        });

        const url =
            `${API_URL}/inscriptions/get-all?${query.toString()}`;


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

    static async detailInscription(token, id_inscription) {

        const res = await fetch(
            `http://localhost:4000/api/admin/inscriptions/detail-inscription/${id_inscription}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await res.json();

        return {
            ok: res.ok,
            data
        };
    }

    static async getCentresByConcours(token, id_concours) {

        const response = await fetch(
            `http://localhost:4000/api/admin/concours/concours-centre/${id_concours}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return await response.json();
    }

    static async updateStatut(token, payload) {

        const res = await fetch(
            "http://localhost:4000/api/admin/inscriptions/update-status",
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },

                body: JSON.stringify(payload)
            }
        );

        return await res.json();
    }

    static async updateCentre(token, payload) {

        const res = await fetch(
            "http://localhost:4000/api/admin/inscriptions/update-candidat-centre",
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },

                body: JSON.stringify(payload)
            }
        );

        return await res.json();
    }

    static async deleteInscription(token, id) {

        const res = await fetch(
            `http://localhost:4000/api/admin/inscriptions/delete-candidat-inscription/${id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await res.json();

        return {
            ok: res.ok,
            data
        };
    }

    static async exportExcel(token) {
        const res = await fetch(
            `${API_URL}/inscriptions/export/excel`,
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
                "Erreur export Excel inscriptions :",
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
            `${API_URL}/inscriptions/export/word`,
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
                "Erreur export Word inscriptions :",
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
            `${API_URL}/inscriptions/export/pdf`,
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
                "Erreur export PDF inscriptions :",
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