const API_URL = "http://localhost:4000/api/admin";

export default class PaiementModel {

    // static async getAllPaiements(token, params = "") {

    //     const res = await fetch(
    //         `http://localhost:4000/api/admin/paiements${params}`,
    //         {
    //             headers: {
    //                 Authorization: `Bearer ${token}`
    //             }
    //         }
    //     );

    //     const data = await res.json();

    //     console.log("RESULTAT API PAIEMENTS :", data);

    //     return {
    //         ok: res.ok,
    //         data
    //     };
    // }

    static async getAllPaiements(token, params = {}) {

        const query = new URLSearchParams({
            draw: params.draw ?? 0,
            start: params.start ?? 0,
            length: params.length ?? 10,
            search: params.search ?? "",
            orderColumn: params.orderColumn ?? 0,
            orderDir: params.orderDir ?? "desc"
        });

       
        const url =
            `http://localhost:4000/api/admin/paiements?${query.toString()}`;


        const res = await fetch(
            url,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await res.json();

      //  console.log("RESULTAT API PAIEMENTS :", data);

        return {
            ok: res.ok,
            data
        };
    }

    static async getPaiementDetail(token, idCandidat) {
        const res = await fetch(
            `${API_URL}/paiements/${idCandidat}`,
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

    static async getPaiementByCandidat(token) {

        const res = await fetch(
            "http://localhost:4000/api/admin/paiement-by-candidat",
            {
                method: "GET",
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

    static async updatePaiementStatus(token, id_paiement, id_candidat, statut_paiement) {

        const res = await fetch(`${API_URL}/paiements/${id_paiement}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                id_candidat,
                statut_paiement
            })
        });

        const result = await res.json();

        return {
            ok: res.ok,
            data: result
        };
    }


    static async exportExcel(token, filters = {}) {
        const params = new URLSearchParams();

        if (filters.statut_paiement) {
            params.append("statut_paiement", filters.statut_paiement);
        }

        if (filters.mode_paiement) {
            params.append("mode_paiement", filters.mode_paiement);
        }

        const query = params.toString();

        const res = await fetch(
            `${API_URL}/paiements/export/excel${query ? `?${query}` : ""}`,
            {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Erreur export Excel paiements :", errorText);

            return {
                ok: false
            };
        }

        return {
            ok: true,
            blob: await res.blob()
        };
    }

    static async exportWord(token, filters = {}) {
        const params = new URLSearchParams();

        if (filters.statut_paiement) {
            params.append("statut_paiement", filters.statut_paiement);
        }

        if (filters.mode_paiement) {
            params.append("mode_paiement", filters.mode_paiement);
        }

        const query = params.toString();

        const res = await fetch(
            `${API_URL}/paiements/export/word${query ? `?${query}` : ""}`,
            {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Erreur export Word paiements :", errorText);

            return {
                ok: false
            };
        }

        return {
            ok: true,
            blob: await res.blob()
        };
    }

    static async exportPDF(token, filters = {}) {
        const params = new URLSearchParams();

        if (filters.statut_paiement) {
            params.append("statut_paiement", filters.statut_paiement);
        }

        if (filters.mode_paiement) {
            params.append("mode_paiement", filters.mode_paiement);
        }

        const query = params.toString();

        const res = await fetch(
            `${API_URL}/paiements/export/pdf${query ? `?${query}` : ""}`,
            {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Erreur export PDF paiements :", errorText);

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

