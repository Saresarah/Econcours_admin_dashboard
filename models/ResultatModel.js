const API_URL = "http://localhost:4000/api/admin";

export default class ResultatModel {

    static async getAllResultats(token, params = {}) {

        const query = new URLSearchParams({

            draw:
                params.draw ?? 0,

            start:
                params.start ?? 0,

            length:
                params.length ?? 10,

            search:
                params.search ?? "",

            orderColumn:
                params.orderColumn ?? 0,

            orderDir:
                params.orderDir ?? "desc"
        });

        const res =
            await fetch(
                `${API_URL}/concours/resultat?${query.toString()}`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            );

        const result =
            await res.json();

        return {
            ok: res.ok,
            data: result
        };
    }

    static async detailResultat(
        token,
        idConcours,
        params = {}
    ) {

        const query =
            new URLSearchParams({

                draw:
                    params.draw ?? 0,

                start:
                    params.start ?? 0,

                length:
                    params.length ?? 10,

                search:
                    params.search ?? "",

                orderColumn:
                    params.orderColumn ?? 0,

                orderDir:
                    params.orderDir ?? "asc"
            });

        const res =
            await fetch(
                `${API_URL}/concours/detail-resultat/${idConcours}?${query.toString()}`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            );

        const result =
            await res.json();

        return {

            ok:
                res.ok,

            data:
                result
        };
    }

    static async exportResultat(
        token,
        idConcours,
        format
    ) {
        const res = await fetch(
            `${API_URL}/resultats/${idConcours}/export/${format}`,
            {
                method: "GET",
                headers: {
                    "Authorization":
                        "Bearer " + token
                }
            }
        );

        if (!res.ok) {
            const error =
                await res.text();

            throw new Error(
                error ||
                "Erreur lors de l'export"
            );
        }

        return await res.blob();
    }
}