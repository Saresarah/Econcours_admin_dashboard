const API_URL = "http://localhost:4000/api/admin";

export default class ConcoursModel {

    static async getAllConcours(token, params = {}) {

        const query = new URLSearchParams({
            draw: params.draw,
            start: params.start,
            length: params.length,
            search: params.search || "",
            orderColumn: params.orderColumn ?? 0,
            orderDir: params.orderDir ?? "asc"
        });

        const res = await fetch(
            `${API_URL}/concours?${query.toString()}`,
            {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        const result = await res.json();

        console.log("RESULT API CONCOURS :", result);

        return {
            ok: res.ok,
            data: result
        };
    }

    static async getConcoursForSelect(token) {

        const limit = 10;
        let start = 0;

        let allConcours = [];
        let total = 0;

        do {
            const query = new URLSearchParams({
                draw: 0,
                start: start,
                length: limit,
                search: "",
                orderColumn: 0,
                orderDir: "asc"
            });

            const res = await fetch(
                `${API_URL}/concours?${query.toString()}`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                }
            );

            const result = await res.json();

            console.log(
                "RESULT API CONCOURS PAGE :",
                result
            );

            if (!res.ok) {
                return {
                    ok: false,
                    data: result
                };
            }

            const concours = Array.isArray(result?.data)
                ? result.data
                : Object.values(result?.data || {});

            allConcours.push(...concours);

            total = result?.recordsTotal || 0;

            start += concours.length;

            if (concours.length === 0) {
                break;
            }

        } while (allConcours.length < total);

        console.log(
            "TOUS LES CONCOURS POUR SELECT :",
            allConcours
        );

        return {
            ok: true,
            data: {
                data: allConcours,
                recordsTotal: allConcours.length,
                recordsFiltered: allConcours.length
            }
        };
    }

    static async getDetailConcours(token, id) {
        const res = await fetch(`${API_URL}/concours/detail/${id}`, {
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

    static async createConcours(token, data) {
        const res = await fetch(`${API_URL}/create-concours`, {
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

    static async updateConcours(id_concours, token, data) {

        const res = await fetch(`${API_URL}/concours/${id_concours}`, {

            method: "PUT",

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

    static async deleteConcours(id_concours, token) {

        const res = await fetch(`${API_URL}/concours/${id_concours}`, {
            method: "DELETE",
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

    static async switchStatutConcours(id_concours, statut_concours, token) {

        const res = await fetch(
            `${API_URL}/concours/${id_concours}/switch-status`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({
                    statut_concours
                })
            }
        );

        const result = await res.json();

        return {
            ok: res.ok,
            data: result
        };
    }

    static async getCandidatsConcours(token, id_concours) {

        const res = await fetch(
            `${API_URL}/inscriptions/concours-candidat/${id_concours}`,
            {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
        );

        return {
            ok: res.ok,
            data: await res.json()
        };
    }

    static async exportExcel(token) {
    const res = await fetch(
        `${API_URL}/concours/export/excel`,
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
            "Erreur export Excel concours :",
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
        `${API_URL}/concours/export/word`,
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
            "Erreur export Word concours :",
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
        `${API_URL}/concours/export/pdf`,
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
            "Erreur export PDF concours :",
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