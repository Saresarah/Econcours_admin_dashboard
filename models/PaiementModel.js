const API_URL = "http://localhost:4000/api/admin";

export default class PaiementModel {

    static async getAllPaiements(token, params = "") {

        const res = await fetch(
            `http://localhost:4000/api/admin/paiements${params}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await res.json();
        
        console.log("RESULTAT API PAIEMENTS :", data);

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
}

