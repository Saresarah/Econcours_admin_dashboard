const API_URL = "http://localhost:4000/api/admin/categories";

export default class CategorieModel {

    static async getAllCategories(token, params) {

        const query = new URLSearchParams({
            draw: params.draw,
            start: params.start,
            length: params.length,
            search: params.search || "",
            orderColumn: params.orderColumn ?? 0,
            orderDir: params.orderDir ?? "asc"
        });

        const res = await fetch(
            `${API_URL}?${query.toString()}`,
            {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        const result = await res.json();

       // console.log("RESULT API CATEGORIES :", result);

        return {
            ok: res.ok,
            data: result
        };
    }

    static async getCategoriesForSelect(token) {

        const limit = 100;
        let start = 0;

        let allCategories = [];

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
                `${API_URL}?${query.toString()}`,
                {
                    method: "GET",

                    headers: {
                        "Authorization": "Bearer " + token
                    }
                }
            );

            const result = await res.json();

            // console.log(
            //     "RESULT API CATEGORIES PAGE :",
            //     result
            // );

            if (!res.ok) {

                return {
                    ok: false,
                    data: result
                };
            }

            const categories = result.data || [];

            allCategories.push(...categories);

            total = result.recordsTotal || 0;

            start += categories.length;

            if (categories.length === 0) {
                break;
            }

        } while (allCategories.length < total);

        // console.log(
        //     "TOUTES LES CATEGORIES POUR SELECT :",
        //     allCategories
        // );

        return {
            ok: true,

            data: {
                data: allCategories,

                recordsTotal: allCategories.length,

                recordsFiltered: allCategories.length
            }
        };
    }

    static async createCategorie(token, data) {

        const res = await fetch(`${API_URL}`, {
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


    static async updateCategorie(id_categorie, data, token) {

        const res = await fetch(`${API_URL}/update-categorie`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },

            body: JSON.stringify({
                id_categorie: Number(id_categorie),
                libelle: data.libelle,
                description: data.description
            })
        });

        const result = await res.json();

        return {
            ok: res.ok,
            data: result
        };
    }

    static async deleteCategorie(id_categorie, token) {

        const res = await fetch(
            `${API_URL}/delete-categorie/${id_categorie}`,
            {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        const result = await res.json();
        
        // console.log("RESULT API CATEGORIES :", result);

        return {
            ok: res.ok,
            data: result
        };
    }
}