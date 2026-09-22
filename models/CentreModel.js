const API_URL = "http://localhost:4000/api/admin/centres";

export default class CentreModel {

    static async createCentre(token, data) {
        const res = await fetch(`${API_URL}/create`, {
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


    static async getAllCentres(token, params = {}) {

        const query = new URLSearchParams({

            draw: params.draw,

            start: params.start,

            length: params.length,

            search: params.search || "",

            orderColumn: params.orderColumn ?? 0,

            orderDir: params.orderDir ?? "asc"

        });

        const res = await fetch(
            `${API_URL}/get-all-centre?${query.toString()}`,
            {
                method: "GET",

                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        const result = await res.json();

        // console.log("RESULT API CENTRES :", result);

        return {
            ok: res.ok,
            data: result
        };
    }

    static async getCentresForSelect(token) {

        const limit = 10;
        let start = 0;
        let allCentres = [];
        let total = 0;

        do {

            const query = new URLSearchParams({
                draw: 0,
                start: start,
                length: limit,
                search: "",
                orderColumn: 1,
                orderDir: "asc"
            });

            const res = await fetch(
                `${API_URL}/get-all-centre?${query.toString()}`,
                {
                    method: "GET",

                    headers: {
                        "Authorization": "Bearer " + token
                    }
                }
            );

            const result = await res.json();

            // console.log(
            //     "RESULT API CENTRES PAGE :",
            //     result
            // );

            if (!res.ok) {

                return {
                    ok: false,
                    data: result
                };
            }

            const centres = result.data || [];

            allCentres.push(...centres);

            total = result.recordsTotal || 0;

            start += centres.length;

            if (centres.length === 0) {
                break;
            }

        } while (allCentres.length < total);

        return {
            ok: true,

            data: {
                data: allCentres,

                recordsTotal: allCentres.length,

                recordsFiltered: allCentres.length
            }
        };
    }

    static async updateCentre(id_centre, token, data) {

        const res = await fetch(
            `${API_URL}/update-centre/${id_centre}`,
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

    static async deleteCentre(id_centre, token) {

        const res = await fetch(
            `${API_URL}/delete-centre/${id_centre}`,
            {
                method: "DELETE",
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

    static async exportExcel(token) {
        const res = await fetch(
            `${API_URL}/export/excel`,
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
                "Erreur export Excel centres :",
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
            `${API_URL}/export/word`,
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
                "Erreur export Word centres :",
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
            `${API_URL}/export/pdf`,
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
                "Erreur export PDF centres :",
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