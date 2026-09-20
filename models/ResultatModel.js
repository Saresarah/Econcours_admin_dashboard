const API_URL = "http://localhost:4000/api/admin";

export default class ResultatModel {
    static async getAllResultats(token, page = 1, limit = 10) {

        const res = await fetch(
            `${API_URL}/concours/resultat?page=${page}&limit=${limit}`,
            {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        const result = await res.json();

        console.log("REPONSE API RESULTATS :", result);

        return {
            ok: res.ok,
            data: result
        };
    }
}