
const API_URL = "http://localhost:4000/api/admin";

export default class CandidatModel {

    static async getAllCandidats(token, params = {}) {

        const query = new URLSearchParams({
            draw: params.draw,
            start: params.start,
            length: params.length,
            search: params.search || "",
            orderColumn: params.orderColumn ?? 0,
            orderDir: params.orderDir ?? "asc"
        });

        const res = await fetch(
            `${API_URL}/candidats/all?${query.toString()}`,
            {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        const result = await res.json();

      //  console.log("RESULT API CANDIDATS :", result);

        return {
            ok: res.ok,
            data: result
        };
    }

    static async getCandidatsForSelect(token) {

        const limit = 10;
        let start = 0;

        let allCandidats = [];
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
                `${API_URL}/candidats/all?${query.toString()}`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                }
            );

            const result = await res.json();

            // console.log(
            //     "RESULT API CANDIDATS PAGE :",
            //     result
            // );

            if (!res.ok) {
                return {
                    ok: false,
                    data: result
                };
            }

            const candidats = Array.isArray(result?.data)
                ? result.data
                : Object.values(result?.data || {});

            allCandidats.push(...candidats);

            total = result?.recordsTotal || 0;

            start += candidats.length;

            if (candidats.length === 0) {
                break;
            }

        } while (allCandidats.length < total);

        // console.log(
        //     "TOUS LES CANDIDATS POUR SELECT :",
        //     allCandidats
        // );

        return {
            ok: true,
            data: {
                data: allCandidats,
                recordsTotal: allCandidats.length,
                recordsFiltered: allCandidats.length
            }
        };
    }

    static async createCandidat(token, data) {
        const res = await fetch(`${API_URL}/candidats/create`, {
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

    static async DeleteCandidat(token, id_candidat) {

        const res = await fetch(`${API_URL}/candidats/delete/${id_candidat}`, {
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

    static async updateCandidat(token, id_candidat, data) {

        const res = await fetch(
            `${API_URL}/candidats/update-candidat/${id_candidat}`,
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


    static async getDetailCandidat(token, id_candidat) {
        const res = await fetch(`${API_URL}/candidats/detail/${id_candidat}`, {
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

    static async exportExcel(token) {

        const url =
            `${API_URL}/candidats/export/excel`;

        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (!res.ok) {

            const errorText =
                await res.text();

            console.error(
                "Erreur export candidats :",
                errorText
            );

            return {
                ok: false
            };
        }

        const blob =
            await res.blob();

        return {
            ok: true,
            blob
        };
    }

    static async exportWord(token) {

        const url =
            `${API_URL}/candidats/export/word`;

        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (!res.ok) {

            const errorText =
                await res.text();

            console.error(
                "Erreur export Word :",
                errorText
            );

            return {
                ok: false
            };
        }

        const blob =
            await res.blob();

        return {
            ok: true,
            blob
        };
    }

    static async exportPDF(token) {
        const url = `${API_URL}/candidats/export/pdf`;

        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Erreur export PDF :", errorText);

            return {
                ok: false
            };
        }

        const blob = await res.blob();

        return {
            ok: true,
            blob
        };
    }
}