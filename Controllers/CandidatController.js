import CandidatModel from "../models/CandidatModel.js";
import CentreModel from "../models/CentreModel.js";
import ConcoursModel from "../models/ConcoursModel.js";
import AdminController from "./AdminController.js";

export default class CandidatController {

    // static async getAll(page = 1, limit = 10) {

    //     const token = AdminController.getToken();

    //     if (!token) {
    //         console.warn("Aucun token admin");

    //         return {
    //             candidat: [],
    //             page: 1,
    //             limit: 10,
    //             total: 0,
    //             totalPages: 0
    //         };
    //     }

    //     const res = await CandidatModel.getAllCandidats(
    //         token,
    //         page,
    //         limit
    //     );

    //     console.log("REPONSE API :", res);

    //     if (!res.ok) {

    //         Swal.fire({
    //             icon: "error",
    //             title: "Erreur",
    //             text: res.data?.error || "Erreur chargement candidats"
    //         });

    //         return {
    //             candidat: [],
    //             page: 1,
    //             limit: 10,
    //             total: 0,
    //             totalPages: 0
    //         };
    //     }

    //     return res.data;
    // }

    // static async initDataTable() {

    //     const tbody = document.getElementById("candidatTableBody");

    //     if (!tbody) {
    //         console.error("tbody introuvable");
    //         return;
    //     }

    //     if ($.fn.DataTable.isDataTable("#dataTable")) {
    //         $("#dataTable").DataTable().destroy();
    //     }

    //     $("#dataTable").DataTable({

    //         processing: true,

    //         serverSide: true,

    //         pageLength: 10,

    //         lengthMenu: [10, 25, 50, 100],

    //         ajax: async function (data, callback) {

    //             try {

    //                 const token = AdminController.getToken();

    //                 const start = data.start;
    //                 const length = data.length;

    //                 const page = Math.floor(start / length) + 1;

    //                 console.log("PAGE DEMANDÉE :", page);
    //                 console.log("LIMIT :", length);

    //                 const res = await CandidatModel.getAllCandidats(
    //                     token,
    //                     page,
    //                     length
    //                 );

    //                 console.log("RÉPONSE API :", res);

    //                 if (!res.ok) {

    //                     Swal.fire({
    //                         icon: "error",
    //                         title: "Erreur",
    //                         text: res.data?.error ||
    //                             "Erreur chargement candidats"
    //                     });

    //                     callback({
    //                         draw: data.draw,
    //                         recordsTotal: 0,
    //                         recordsFiltered: 0,
    //                         data: []
    //                     });

    //                     return;
    //                 }

    //                 const result = res.data;

    //                 console.log("DONNÉES CANDIDATS :", result);

    //                 const candidats = result.data || [];

    //                 callback({

    //                     draw: data.draw,

    //                     recordsTotal: result.total || 0,

    //                     recordsFiltered: result.total || 0,

    //                     data: candidats.map((data, index) => {

    //                         return [
    //                             start + index + 1,

    //                             data.nom || "-",

    //                             data.prenom || "-",

    //                             data.numero_cnib || "-",    
    //                             data.telephone || "-",

    //                             data.email || "-",

    //                             data.type_candidat || "-",

    //                             `
    //                         <button
    //                             class="btn btn-warning btn-sm edit-candidat"
    //                             data-id="${data.id_candidat}"
    //                             data-email="${data.email || ""}"
    //                             data-nom-jeune-fille="${data.nom_jeune_fille || ""}"
    //                             data-emploi="${data.emploi || ""}"
    //                             data-ministere="${data.ministere || ""}"
    //                             data-matricule="${data.matricule || ""}">
    //                             <i class="fa fa-edit"></i>
    //                         </button>
    //                         `,

    //                             `
    //                         <button
    //                             class="btn btn-danger btn-sm delete-candidat"
    //                             data-id="${data.id_candidat}">
    //                             <i class="fa fa-trash"></i>
    //                         </button>
    //                         `,

    //                             `
    //                         <button
    //                             class="btn btn-info btn-sm detail-candidat"
    //                             data-id="${data.id_candidat}">
    //                             <i class="fa fa-eye"></i>
    //                         </button>
    //                         `
    //                         ];

    //                     })

    //                 });

    //             } catch (error) {

    //                 console.error(
    //                     "Erreur DataTable candidats :",
    //                     error
    //                 );

    //                 callback({
    //                     draw: data.draw,
    //                     recordsTotal: 0,
    //                     recordsFiltered: 0,
    //                     data: []
    //                 });

    //                 Swal.fire({
    //                     icon: "error",
    //                     title: "Erreur",
    //                     text: "Impossible de charger les candidats"
    //                 });

    //             }

    //         },

    //         columns: [

    //             {
    //                 title: "#",
    //                 className: "text-center"
    //             },

    //             {
    //                 title: "Nom",
    //                 className: "text-center"
    //             },

    //             {
    //                 title: "Prénom",
    //                 className: "text-center"
    //             },

    //             {
    //                 title: "CNIB",
    //                 className: "text-center"
    //             },

    //             {
    //                 title: "Téléphone",
    //                 className: "text-center"
    //             },

    //             {
    //                 title: "Email",
    //                 className: "text-center"
    //             },

    //             {
    //                 title: "Type candidat",
    //                 className: "text-center"
    //             },

    //             {
    //                 title: "Modifier",
    //                 className: "text-center",
    //                 orderable: false,
    //                 searchable: false
    //             },

    //             {
    //                 title: "Supprimer",
    //                 className: "text-center",
    //                 orderable: false,
    //                 searchable: false
    //             },

    //             {
    //                 title: "Détails",
    //                 className: "text-center",
    //                 orderable: false,
    //                 searchable: false
    //             }

    //         ],

    //         responsive: true,

    //         searching: true,

    //         ordering: true,

    //         language: {
    //             url: "https://cdn.datatables.net/plug-ins/1.13.7/i18n/fr-FR.json"
    //         },

    //         layout: {

    //             topStart: [
    //                 "pageLength",
    //                 {
    //                     buttons: [
    //                         "copy",
    //                         "excel",
    //                         "csv",
    //                         "pdf"
    //                     ]
    //                 }
    //             ],

    //             topEnd: "search",

    //             bottomStart: "info",

    //             bottomEnd: "paging"

    //         }

    //     });

    // }
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

        const res = await CandidatModel.getAllCandidats(
            token,
            params
        );

        console.log("REPONSE API :", res);

        if (!res.ok) {

            Swal.fire({
                icon: "error",
                title: "Erreur",
                text: res.data?.error ||
                    "Erreur chargement candidats"
            });

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

        const tbody = document.getElementById("candidatTableBody");

        if (!tbody) {
            console.error("tbody introuvable");
            return;
        }

        if ($.fn.DataTable.isDataTable("#dataTable")) {
            $("#dataTable").DataTable().destroy();
        }

        $("#dataTable").DataTable({

            processing: true,

            serverSide: true,

            pageLength: 10,

            lengthMenu: [10, 25, 50, 100],

            ajax: async function (data, callback) {

                try {

                    const token = AdminController.getToken();

                    if (!token) {
                        callback({
                            draw: data.draw,
                            recordsTotal: 0,
                            recordsFiltered: 0,
                            data: []
                        });

                        return;
                    }

                    const params = {
                        draw: data.draw,

                        start: data.start,

                        length: data.length,

                        search: data.search?.value || "",

                        orderColumn: data.order?.[0]?.column ?? 0,

                        orderDir: data.order?.[0]?.dir ?? "asc"
                    };

                    console.log("PARAMÈTRES DATATABLES :", params);

                    const res = await CandidatModel.getAllCandidats(
                        token,
                        params
                    );

                    console.log("RÉPONSE API :", res);

                    if (!res.ok) {

                        Swal.fire({
                            icon: "error",
                            title: "Erreur",
                            text: res.data?.error ||
                                "Erreur chargement candidats"
                        });

                        callback({
                            draw: data.draw,
                            recordsTotal: 0,
                            recordsFiltered: 0,
                            data: []
                        });

                        return;
                    }

                    const result = res.data;

                    console.log("RÉSULTAT DATATABLES :", result);

                    callback(result);

                } catch (error) {

                    console.error(
                        "Erreur DataTable candidats :",
                        error
                    );

                    callback({
                        draw: data.draw,
                        recordsTotal: 0,
                        recordsFiltered: 0,
                        data: []
                    });

                    Swal.fire({
                        icon: "error",
                        title: "Erreur",
                        text: "Impossible de charger les candidats"
                    });
                }
            },

            columns: [

                {
                    data: null,
                    title: "#",
                    className: "text-center",
                    orderable: false,
                    searchable: false,
                    render: function (data, type, row, meta) {
                        return meta.settings._iDisplayStart + meta.row + 1;
                    }
                },

                {
                    data: "nom",
                    title: "Nom",
                    className: "text-center"
                },

                {
                    data: "prenom",
                    title: "Prénom",
                    className: "text-center"
                },

                {
                    data: "numero_cnib",
                    title: "CNIB",
                    className: "text-center",
                    render: function (data) {
                        return data || "-";
                    }
                },

                {
                    data: "telephone",
                    title: "Téléphone",
                    className: "text-center",
                    render: function (data) {
                        return data || "-";
                    }
                },

                {
                    data: "email",
                    title: "Email",
                    className: "text-center",
                    render: function (data) {
                        return data || "-";
                    }
                },

                {
                    data: "type_candidat",
                    title: "Type candidat",
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

                    render: function (data, type, row) {

                        return `
                        <button
                            class="btn btn-warning btn-sm edit-candidat"
                            data-id="${row.id_candidat}"
                            data-email="${row.email || ""}"
                            data-nom-jeune-fille="${row.nom_jeune_fille || ""}"
                            data-emploi="${row.emploi || ""}"
                            data-ministere="${row.ministere || ""}"
                            data-matricule="${row.matricule || ""}">
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

                    render: function (data, type, row) {

                        return `
                        <button
                            class="btn btn-danger btn-sm delete-candidat"
                            data-id="${row.id_candidat}">
                            <i class="fa fa-trash"></i>
                        </button>
                    `;
                    }
                },

                {
                    data: null,
                    title: "Détails",
                    className: "text-center",
                    orderable: false,
                    searchable: false,

                    render: function (data, type, row) {

                        return `
                        <button
                            class="btn btn-info btn-sm detail-candidat"
                            data-id="${row.id_candidat}">
                            <i class="fa fa-eye"></i>
                        </button>
                    `;
                    }
                }

            ],

            responsive: true,

            searching: true,

            ordering: true,

            searchDelay: 500,

            language: {
                url: "https://cdn.datatables.net/plug-ins/1.13.7/i18n/fr-FR.json"
            },

            layout: {
                topStart: [
                    "pageLength",
                    {
                        buttons: [
                            {
                                text: '<i class="fa fa-file-excel"></i> Excel',
                                className: "btn-export-excel",
                                action: async function () {
                                    await CandidatController.exportExcel();
                                }
                            },
                            {
                                text: '<i class="fa fa-file-word"></i> Word',
                                className: "btn-export-word",
                                action: async function () {
                                    await CandidatController.exportWord();
                                }
                            },
                            {
                                text: '<i class="fa fa-file-pdf"></i> PDF',
                                className: "btn-export-pdf",
                                action: async function () {
                                    await CandidatController.exportPDF();
                                }
                            }
                        ]
                    }
                ],
                topEnd: "search",
                bottomStart: "info",
                bottomEnd: "paging"
            }
        });
    }


    static initDeleteButtons() {

        document.addEventListener("click", async (e) => {

            const button = e.target.closest(".delete-candidat");

            if (!button) return;

            const id = button.dataset.id;

            const confirm = await Swal.fire({
                title: "Supprimer ?",
                text: "Cette action est irréversible",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Oui",
                cancelButtonText: "Annuler"
            });

            if (!confirm.isConfirmed) return;

            const token = AdminController.getToken();

            const res = await CandidatModel.DeleteCandidat(token, id);

            console.log(res);

            if (!res?.ok) {
                Swal.fire("Erreur", "Suppression impossible", "error");
                return;
            }

            Swal.fire("Succès", res.data?.message || "OK", "success");

            // reload tableau
            await this.initDataTable();

        });
    }

    static initEditModal() {

        document.addEventListener("click", (e) => {

            const btn = e.target.closest(".edit-candidat");
            if (!btn) return;

            // remplir modal
            document.getElementById("id_candidat").value = btn.dataset.id;
            document.getElementById("email_modif").value = btn.dataset.email;
            document.getElementById("nom_jeune_fille_modif").value = btn.dataset.nomJeuneFille;
            document.getElementById("emploi_modif").value = btn.dataset.emploi;
            document.getElementById("ministere_modif").value = btn.dataset.ministere;
            document.getElementById("matricule_modif").value = btn.dataset.matricule;

            // ouvrir modal bootstrap
            $("#modifier_candidat").modal("show");

        });

    }

    static initEditSubmit() {

        document.querySelector("#modifier_candidat form")
            .addEventListener("submit", async (e) => {

                e.preventDefault();

                const id = document.getElementById("id_candidat").value;

                const data = {
                    email: document.getElementById("email_modif").value,
                    nom_jeune_fille: document.getElementById("nom_jeune_fille_modif").value,
                    mot_de_passe: document.getElementById("mot_de_passe_modif").value,
                    emploi: document.getElementById("emploi_modif").value,
                    ministere: document.getElementById("ministere_modif").value,
                    matricule: document.getElementById("matricule_modif").value,
                };

                const token = AdminController.getToken();
                const res = await CandidatModel.updateCandidat(token, id, data);

                if (!res.ok) {

                    Swal.fire(
                        "Erreur",
                        res.data?.error || "Modification échouée",
                        "error"
                    );
                    return;

                }

                Swal.fire(
                    "Succès",
                    res.data?.message || "Candidat modifié",
                    "success"
                );

                // fermer modal
                $("#modifier_candidat").modal("hide");

                // refresh datatable SANS reload page
                await this.initDataTable();

            });

    }


    static initDetails() {

        document.addEventListener("click", async (e) => {

            const btn = e.target.closest(".detail-candidat");

            if (!btn) return;

            const id = btn.dataset.id;

            const token = AdminController.getToken();

            const res = await CandidatModel.getDetailCandidat(token, id);

            console.log("DETAIL RESPONSE :", res);

            if (!res.ok) {

                Swal.fire(
                    "Erreur",
                    res.data?.error || "Impossible de charger",
                    "error"
                );

                return;

            }

            const data = res.data.resp[0];

            const candidat = data.candidat;
            const inscriptions = data.inscription;

            let concoursHTML = "";

            // verifier inscriptions
            if (inscriptions.length === 0) {

                concoursHTML = `
<tr>
<td colspan="5" class="text-center">
Aucune inscription
</td>
</tr>
`;

            } else {

                inscriptions.forEach((inscription) => {

                    concoursHTML += `

<tr>

<td>
${inscription.concours.nom}
</td>

<td>
${inscription.concours.type}
</td>

<td>
${inscription.concours.categorie.libelle}
</td>

<td>
${inscription.paiement?.statut_paiement || 'NON PAYE'}
</td>

<td>
${new Date(
                        inscription.date_inscription
                    ).toLocaleDateString()}
</td>

</tr>

`;

                });

            }

            document.getElementById("detailContent").innerHTML = `

<div class="row">

<div class="col-md-6">

<p>
<strong>Nom :</strong>
${candidat.nom}
</p>

<p>
<strong>Prénom :</strong>
${candidat.prenom}
</p>

<p>
<strong>Email :</strong>
${candidat.email || '-'}
</p>

<p>
<strong>Téléphone :</strong>
${candidat.telephone}
</p>

<p>
<strong>Sexe :</strong>
${candidat.sexe}
</p>

</div>

<div class="col-md-6">

<p>
<strong>Type :</strong>
${candidat.type_candidat}
</p>

<p>
<strong>Statut :</strong>
${candidat.statut_compte}
</p>

<p>
<strong>CNIB :</strong>
${candidat.numero_cnib}
</p>

<p>
<strong>Lieu naissance :</strong>
${candidat.lieu_naissance}
</p>

<p>
<strong>Pays :</strong>
${candidat.pays_naissance}
</p>

</div>

</div>

<hr>

<h5>
Concours inscrits
</h5>
<div class="table-responsive">
<table class="table table-bordered table-striped">

<thead>

<tr>
<th>Concours</th>
<th>Type</th>
<th>Catégorie</th>
<th>Paiement</th>
<th>Date inscription</th>
</tr>

</thead>

<tbody>

${concoursHTML}

</tbody>

</table>
</div>

`;

            $("#detailCandidatModal").modal("show");

        });

    }

    // =========================
    // CREER CANDIDAT
    // =========================

    static async registerCandidat() {

        const form = document.getElementById("formCandidat");

        if (!form) return;

        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const token = AdminController.getToken();

            const formData = new FormData(form);

            const data = Object.fromEntries(formData.entries());

            console.log("DATA ENVOYÉE :", data);

            const res = await CandidatModel.createCandidat(token, data);

            if (!res.ok) {
                Swal.fire({
                    icon: "error",
                    title: "Erreur",
                    text: res.data.error || "Erreur création"
                });

                return;
            }
            Swal.fire({
                icon: "success",
                title: "Succès",
                text: res.data.message || "Candidat créé avec succès"
            });
            // fermer modal
            $('#ajouter_candidat').modal('hide');

            // reset form
            form.reset();

            // reload datatable
            await this.initDataTable();
        });
    }


    static async exportExcel() {

        const token =
            AdminController.getToken();

        if (!token) {

            Swal.fire({
                icon: "warning",
                title: "Session expirée",
                text: "Veuillez vous reconnecter."
            });

            return;
        }

        try {

            Swal.fire({
                title: "Export en cours...",
                text: "Préparation du fichier Excel.",
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const res =
                await CandidatModel.exportExcel(token);

            if (!res.ok) {

                Swal.close();

                Swal.fire({
                    icon: "error",
                    title: "Erreur",
                    text:
                        "Impossible d'exporter les candidats."
                });

                return;
            }

            const url =
                window.URL.createObjectURL(res.blob);

            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                `candidats_${new Date()
                    .toISOString()
                    .slice(0, 10)}.xlsx`;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

            Swal.close();

            Swal.fire({
                icon: "success",
                title: "Export terminé",
                text:
                    "Tous les candidats ont été exportés.",
                timer: 2000,
                showConfirmButton: false
            });

        } catch (error) {

            console.error(
                "Erreur export Excel :",
                error
            );

            Swal.close();

            Swal.fire({
                icon: "error",
                title: "Erreur",
                text:
                    "Une erreur est survenue pendant l'export."
            });
        }
    }

    static async exportWord() {

        const token =
            AdminController.getToken();

        if (!token) {

            Swal.fire({
                icon: "warning",
                title: "Session expirée",
                text:
                    "Veuillez vous reconnecter."
            });

            return;
        }

        try {

            Swal.fire({
                title: "Export en cours...",
                text:
                    "Préparation du document Word.",
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const res =
                await CandidatModel.exportWord(
                    token
                );

            if (!res.ok) {

                Swal.close();

                Swal.fire({
                    icon: "error",
                    title: "Erreur",
                    text:
                        "Impossible d'exporter les candidats."
                });

                return;
            }

            const url =
                window.URL.createObjectURL(
                    res.blob
                );

            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                `candidats_${new Date()
                    .toISOString()
                    .slice(0, 10)}.docx`;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

            Swal.close();

            Swal.fire({
                icon: "success",
                title: "Export terminé",
                text:
                    "Tous les candidats ont été exportés dans Word.",
                timer: 2000,
                showConfirmButton: false
            });

        } catch (error) {

            console.error(
                "Erreur export Word :",
                error
            );

            Swal.close();

            Swal.fire({
                icon: "error",
                title: "Erreur",
                text:
                    "Une erreur est survenue pendant l'export."
            });
        }
    }

    static async exportPDF() {
        const token = AdminController.getToken();

        if (!token) {
            Swal.fire({
                icon: "warning",
                title: "Session expirée",
                text: "Veuillez vous reconnecter."
            });

            return;
        }

        try {
            Swal.fire({
                title: "Export en cours...",
                text: "Préparation du document PDF.",
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const res = await CandidatModel.exportPDF(token);

            if (!res.ok) {
                Swal.close();

                Swal.fire({
                    icon: "error",
                    title: "Erreur",
                    text: "Impossible d'exporter les candidats en PDF."
                });

                return;
            }

            const url = window.URL.createObjectURL(res.blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `candidats_${new Date().toISOString().slice(0, 10)}.pdf`;

            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);

            Swal.close();

            Swal.fire({
                icon: "success",
                title: "Export terminé",
                text: "Tous les candidats ont été exportés en PDF.",
                timer: 2000,
                showConfirmButton: false
            });

        } catch (error) {
            console.error("Erreur export PDF :", error);

            Swal.close();

            Swal.fire({
                icon: "error",
                title: "Erreur",
                text: "Une erreur est survenue pendant l'export PDF."
            });
        }
    }

}