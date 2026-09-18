import CentreModel from "../models/CentreModel.js";
import AdminController from "./AdminController.js";

export default class CentreController {

    static initCreateCentre() {

        const form = document.getElementById("formAjoutCentre");

        if (!form) return;

        form.addEventListener("submit", async (e) => {

            e.preventDefault();

            const token = AdminController.getToken();

            const data = {
                nom: document.getElementById("nom").value
            };

            const res = await CentreModel.createCentre(
                token,
                data
            );

            if (!res.ok) {

                Swal.fire(
                    "Erreur",
                    res.data.error || "Erreur création centre",
                    "error"
                );

                return;
            }

            Swal.fire(
                "Succès",
                "Centre créé avec succès",
                "success"
            );

            form.reset();

            $("#ajouter_centre").modal("hide");

            this.initDataTable();
        });
    }

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

        const res = await CentreModel.getAllCentres(
            token,
            params
        );

        console.log("RÉPONSE API CENTRES :", res);

        if (!res.ok) {

            Swal.fire(
                "Erreur",
                "Impossible de charger les centres",
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

        console.log("INIT DATATABLE CENTRES");

        const tbody = document.getElementById("centreTableBody");

        if (!tbody) {
            console.error("tbody centres introuvable");
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
                        "PARAMÈTRES DATATABLES CENTRES :",
                        params
                    );

                    const result =
                        await CentreController.getAll(params);

                    console.log(
                        "RÉSULTAT DATATABLES CENTRES :",
                        result
                    );

                    callback(result);

                } catch (error) {

                    console.error(
                        "Erreur DataTable centres :",
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
                        "Impossible de charger les centres",
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
                    data: "nom",

                    title: "Nom",

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
                        centre
                    ) {

                        return `
                        <button
                            class="btn btn-warning btn-sm btn-edit"
                            data-id="${centre.id_centre}"
                            data-nom="${centre.nom || ""}">
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
                        centre
                    ) {

                        return `
                        <button
                            class="btn btn-danger btn-sm btn-delete"
                            data-id="${centre.id_centre}">
                            <i class="fa fa-trash"></i>
                        </button>
                    `;
                    }
                }

            ],

            language: {
                url: "https://cdn.datatables.net/plug-ins/1.13.7/i18n/fr-FR.json"
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

    static initEditCentre() {

        const form = document.getElementById("formUpdateCentre");

        if (!form) return;

        document.addEventListener("click", (e) => {

            const btn = e.target.closest(".btn-edit");

            if (!btn) return;

            document.getElementById("id_centre_modif").value =
                btn.dataset.id;

            document.getElementById("nom_centre_modif").value =
                btn.dataset.nom;

            $("#modifier_centre").modal("show");
        });

        form.addEventListener("submit", async (e) => {

            e.preventDefault();

            const token = AdminController.getToken();

            const id_centre =
                document.getElementById("id_centre_modif").value;

            const data = {
                nom: document.getElementById("nom_centre_modif").value
            };

            const res = await CentreModel.updateCentre(
                id_centre,
                token,
                data
            );

            if (!res.ok) {

                Swal.fire(
                    "Erreur",
                    res.data.error || "Erreur modification",
                    "error"
                );

                return;
            }

            Swal.fire(
                "Succès",
                res.data.message,
                "success"
            );

            $("#modifier_centre").modal("hide");

            await this.initDataTable();
        });
    }

    static initDeleteCentre() {

        document.addEventListener("click", async (e) => {

            const btn = e.target.closest(".btn-delete");
            if (!btn) return;

            const id = btn.dataset.id;

            const token = AdminController.getToken();

            const confirm = await Swal.fire({
                title: "Confirmer suppression ?",
                text: "Cette action est irréversible",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Oui supprimer"
            });

            if (!confirm.isConfirmed) return;

            const res = await CentreModel.deleteCentre(id, token);

            if (!res.ok) {

                Swal.fire("Erreur", res.data.error, "error");
                return;
            }

            Swal.fire("Succès", res.data.message, "success");

            await this.initDataTable();
        });
    }
}
