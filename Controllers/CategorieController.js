import CategorieModel from "../models/CategorieModel.js";
import AdminController from "./AdminController.js";

export default class CategorieController {

    static async getAll(params) {

        const token = AdminController.getToken();

        if (!token) {

            console.warn("Aucun token admin");

            return {
                draw: params?.draw ?? 0,
                recordsTotal: 0,
                recordsFiltered: 0,
                data: []
            };
        }

        const res = await CategorieModel.getAllCategories(
            token,
            params
        );

        console.log("RÉPONSE API CATEGORIES :", res);

        if (!res.ok) {

            Swal.fire(
                "Erreur",
                res.data?.error ||
                "Impossible de charger les catégories",
                "error"
            );

            return {
                draw: params?.draw ?? 0,
                recordsTotal: 0,
                recordsFiltered: 0,
                data: []
            };
        }

        return res.data;
    }

    static async initDataTable() {

        console.log("INIT DATATABLE CATEGORIES");

        const tbody = document.querySelector("#dataTable tbody");

        if (!tbody) {
            console.error("tbody catégories introuvable");
            return;
        }

        if ($.fn.DataTable.isDataTable("#dataTable")) {
            $("#dataTable").DataTable().destroy();
        }

        $("#dataTable").DataTable({

            processing: true,

            serverSide: true,

            responsive: true,

            pageLength: 10,

            lengthMenu: [10, 25, 50, 100],

            searching: true,

            ordering: true,

            searchDelay: 500,

            ajax: async function (data, callback) {

                try {

                    const params = {

                        draw: data.draw,

                        start: data.start,

                        length: data.length,

                        search: data.search?.value || "",

                        orderColumn:
                            data.order?.[0]?.column ?? 0,

                        orderDir:
                            data.order?.[0]?.dir ?? "asc"
                    };

                    console.log(
                        "PARAMÈTRES DATATABLES CATEGORIES :",
                        params
                    );

                    const result =
                        await CategorieController.getAll(params);

                    console.log(
                        "RÉSULTAT DATATABLES CATEGORIES :",
                        result
                    );

                    callback(result);

                } catch (error) {

                    console.error(
                        "Erreur DataTable catégories :",
                        error
                    );

                    callback({

                        draw: data.draw,

                        recordsTotal: 0,

                        recordsFiltered: 0,

                        data: []

                    });

                    Swal.fire(
                        "Erreur",
                        "Impossible de charger les catégories",
                        "error"
                    );
                }
            },

            columns: [

                {
                    data: null,

                    title: "#",

                    className: "text-center",

                    orderable: false,

                    searchable: false,

                    render: function (
                        data,
                        type,
                        row,
                        meta
                    ) {

                        return (
                            meta.settings._iDisplayStart +
                            meta.row +
                            1
                        );
                    }
                },

                {
                    data: "libelle",

                    title: "Libellé",

                    className: "text-center",

                    render: function (data) {

                        return data || "-";
                    }
                },

                {
                    data: "description",

                    title: "Description",

                    className: "text-center",

                    render: function (data) {

                        return data || "-";
                    }
                },

                {
                    data: null,

                    title: "Modifier",

                    className: "text-center",

                    orderable: false,

                    searchable: false,

                    render: function (
                        data,
                        type,
                        categorie
                    ) {

                        return `
                        <button
                            class="btn btn-warning btn-sm edit-categorie"
                            data-id="${categorie.id}"
                            data-libelle="${categorie.libelle || ""}"
                            data-description="${categorie.description || ""}">
                            <i class="fa fa-edit"></i>
                        </button>
                    `;
                    }
                },

                {
                    data: null,

                    title: "Supprimer",

                    className: "text-center",

                    orderable: false,

                    searchable: false,

                    render: function (
                        data,
                        type,
                        categorie
                    ) {

                        return `
                        <button
                            class="btn btn-danger btn-sm delete-categorie"
                            data-id="${categorie.id}">
                            <i class="fa fa-trash"></i>
                        </button>
                    `;
                    }
                }

            ],

            language: {

                url:
                    "https://cdn.datatables.net/plug-ins/1.13.7/i18n/fr-FR.json"
            },

            layout: {

                topStart: [

                    "pageLength",

                    {
                        buttons: [
                            "copy",
                            "excel",
                            "csv",
                            "pdf"
                        ]
                    }

                ],

                topEnd: "search",

                bottomStart: "info",

                bottomEnd: "paging"
            }

        });
    }
    
    static initCreateCategorie() {

        const form = document.getElementById("formAjoutCategorie");

        if (!form) return;

        form.addEventListener("submit", async (e) => {

            e.preventDefault();

            const token = AdminController.getToken();

            const data = {
                libelle: document.getElementById("libelle").value,
                description: document.getElementById("description").value
            };

            const res = await CategorieModel.createCategorie(token, data);

            if (!res.ok) {

                Swal.fire(
                    "Erreur",
                    res.data.error || res.data.message || "Erreur création catégorie",
                    "error"
                );

                return;
            }

            Swal.fire(
                "Succès",
                res.data.message,
                "success"
            );

            form.reset();

            $("#ajouter_categorie").modal("hide");

            this.initDataTable();
        });
    }

    static initEditButtons() {

        document.addEventListener("click", (e) => {

            const btn =
                e.target.closest(".edit-categorie");

            if (!btn) return;

            document.getElementById("id_categorie").value =
                btn.dataset.id;

            document.getElementById("libelle_modif").value =
                btn.dataset.libelle;

            document.getElementById("description_modif").value =
                btn.dataset.description;

            $("#modifier_categorie").modal("show");
        });
    }

    static initUpdateCategorie() {

        const form =
            document.getElementById(
                "formModificationCategorie"
            );

        if (!form) return;

        form.addEventListener(
            "submit",
            async (e) => {

                e.preventDefault();


                const token =
                    AdminController.getToken();

                const id_categorie =
                    document.getElementById("id_categorie").value;

                const data = {
                    libelle:
                        document.getElementById("libelle_modif").value,

                    description:
                        document.getElementById("description_modif").value
                };
                console.log(token);

                console.log(data);

                const res = await CategorieModel.updateCategorie(
                    id_categorie,
                    data,
                    token
                );

                console.log(res);

                if (!res.ok) {

                    Swal.fire(
                        "Erreur",
                        res.data.error ||
                        "Modification impossible",
                        "error"
                    );

                    return;
                }

                Swal.fire(
                    "Succès",
                    res.data.message,
                    "success"
                );

                $("#modifier_categorie").modal("hide");

                this.initDataTable();
            }
        );
    }

    static initDeleteButtons() {

        document.addEventListener("click", async (e) => {

            const btn = e.target.closest(".delete-categorie");
            if (!btn) return;

            const id = btn.dataset.id;

            const token = AdminController.getToken();

            Swal.fire({
                title: "Confirmer la suppression ?",
                text: "Cette action est irréversible",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Oui supprimer",
                cancelButtonText: "Annuler"
            }).then(async (result) => {

                if (!result.isConfirmed) return;

                const res = await CategorieModel.deleteCategorie(id, token);

                if (!res.ok) {
                    Swal.fire("Erreur", res.data.error || "Suppression impossible", "error");
                    return;
                }

                Swal.fire("Succès", res.data.message, "success");

                CategorieController.initDataTable(); // refresh sans reload page
            });
        });


    }

}    