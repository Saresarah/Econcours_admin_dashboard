import InscriptionModel from "../models/InscriptionModel.js";
import CandidatModel from "../models/CandidatModel.js";
import CentreModel from "../models/CentreModel.js";
import ConcoursModel from "../models/ConcoursModel.js";
import AdminController from "./AdminController.js";

export default class InscriptionController {

    static initInscriptionConcours() {

        const form = document.getElementById("formInscriptionConcours");

        if (!form) return;

        form.addEventListener("submit", async (e) => {

            e.preventDefault();

            const token = AdminController.getToken();

            const id_candidat = document.getElementById("id_candidat").value;
            const id_concours = document.getElementById("id_concours").value;
            const id_centre = document.getElementById("id_centre").value;

            if (!id_candidat || !id_concours || !id_centre) {

                Swal.fire(
                    "Erreur",
                    "Tous les champs sont obligatoires",
                    "error"
                );

                return;
            }

            const data = {
                id_candidat: document.getElementById("id_candidat").value,
                id_concours: Number(id_concours),
                id_centre: Number(id_centre)
            };

            console.log("DATA INSCRIPTION :", data);

            const res = await InscriptionModel.inscrireConcours(token, data);

            if (!res.ok) {

                Swal.fire(
                    "Erreur",
                    res.data.error || "Erreur lors de l'inscription",
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

            $("#ajouter_inscription").modal("hide");

        });
    }

    static async loadConcours() {

        const token = AdminController.getToken();

        const res = await ConcoursModel.getConcoursForSelect(token);

        const select = $("#id_concours");

        select.empty();

        select.append(
            `<option value="">Sélectionnez un concours</option>`
        );

        res.data.data.forEach(concours => {

            select.append(`
            <option value="${concours.id_concours}">
                ${concours.nom}
            </option>
        `);
        });

        select.select2({
            dropdownParent: $("#ajouter_inscription"),
            width: "100%",
            placeholder: "Sélectionnez un concours"
        });
    }

    static async loadCandidats() {

        const token = AdminController.getToken();

        const res = await CandidatModel.getCandidatsForSelect(token);

        console.log("CANDIDATS :", res);

        const select = $("#id_candidat");

        select.empty();

        select.append(`<option value="">Sélectionnez un candidat</option>`);
        console.log("Premier candidat :", res.data.data[0]);
        res.data.data.forEach(c => {

            select.append(`
            <option value="${c.id_candidat}">
                ${c.nom} ${c.prenom}
            </option>
        `);
        });

        select.select2({
            dropdownParent: $("#ajouter_inscription"),
            width: "100%",
            placeholder: "Sélectionnez un candidat"
        });
    }

    static async loadCentres() {

        const token = AdminController.getToken();

        const res = await CentreModel.getCentresForSelect(token);

        const select = $("#id_centre");

        select.empty();

        select.append(
            `<option value="">Sélectionnez un centre</option>`
        );

        res.data.data.forEach(centre => {

            select.append(`
            <option value="${centre.id_centre}">
                ${centre.nom}
            </option>
        `);
        });

        select.select2({
            dropdownParent: $("#ajouter_inscription"),
            width: "100%",
            placeholder: "Sélectionnez un centre"
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

        const res =
            await InscriptionModel.getAllInscriptions(
                token,
                params
            );

        console.log(
            "RÉPONSE API INSCRIPTIONS :",
            res
        );

        if (!res.ok) {

            Swal.fire(
                "Erreur",
                "Impossible de charger les inscriptions",
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

    static initDataTable() {

        if ($.fn.DataTable.isDataTable("#inscriptionTable")) {
            $("#inscriptionTable")
                .DataTable()
                .destroy();
        }

        $("#inscriptionTable").DataTable({

            processing: true,

            serverSide: true,

            responsive: true,

            pageLength: 10,

            lengthMenu: [
                [10, 25, 50, 100],
                [10, 25, 50, 100]
            ],

            searching: true,

            ordering: true,

            info: true,

            searchDelay: 500,

            // ajax: async function (data, callback) {

            //     try {

            //         const params = {

            //             draw: data.draw,

            //             start: data.start,

            //             length: data.length,

            //             search:
            //                 data.search?.value || "",

            //             orderColumn:
            //                 data.order?.[0]?.column ?? 0,

            //             orderDir:
            //                 data.order?.[0]?.dir ?? "asc"
            //         };

            //         console.log(
            //             "PARAMÈTRES DATATABLES INSCRIPTIONS :",
            //             params
            //         );

            //         const result =
            //             await InscriptionController.getAll(
            //                 params
            //             );

            //         console.log(
            //             "RÉSULTAT DATATABLES INSCRIPTIONS :",
            //             result
            //         );

            //         const inscriptions =
            //             Array.isArray(result?.data)
            //                 ? result.data
            //                 : Object.values(
            //                     result?.data || {}
            //                 );

            //         const rows =
            //             inscriptions.map(
            //                 (item, index) => {

            //                     const candidat =
            //                         item.candidat || {};

            //                     const listeInscriptions =
            //                         item.inscriptions || [];

            //                     const preview =
            //                         listeInscriptions
            //                             .slice(0, 2)
            //                             .map(i => `
            //                             <div>
            //                                 <b>
            //                                     ${i.concours?.nom || "-"}
            //                                 </b>
            //                             </div>
            //                         `)
            //                             .join("");

            //                     const autres =
            //                         listeInscriptions.length > 2
            //                             ? `
            //                             <span class="badge badge-info">
            //                                 +${listeInscriptions.length - 2} autres
            //                             </span>
            //                         `
            //                             : "";

            //                     return [

            //                         params.start + index + 1,

            //                         `
            //                         ${candidat.nom || ""}
            //                         ${candidat.prenom || ""}
            //                     `,

            //                         `
            //                         ${preview}
            //                         ${autres}
            //                     `,

            //                         `
            //                         <button
            //                             class="btn btn-info btn-sm btn-detail-candidat"
            //                             data-id="${candidat.id_candidat}">
            //                             <i class="fa fa-eye"></i>
            //                         </button>
            //                     `
            //                     ];
            //                 }
            //             );

            //         callback({

            //             draw: result?.draw ?? data.draw,

            //             recordsTotal:
            //                 result?.recordsTotal ?? 0,

            //             recordsFiltered:
            //                 result?.recordsFiltered ?? 0,

            //             data: rows
            //         });

            //     } catch (error) {

            //         console.error(
            //             "ERREUR DATATABLE INSCRIPTIONS :",
            //             error
            //         );

            //         callback({

            //             draw: data.draw,

            //             recordsTotal: 0,

            //             recordsFiltered: 0,

            //             data: []
            //         });
            //     }
            // },

            ajax: async function (data, callback) {

                console.log("1️⃣ DATATABLE → REQUÊTE INSCRIPTIONS", data);

                try {

                    const params = {
                        draw: data.draw,
                        start: data.start,
                        length: data.length,
                        search: data.search?.value || "",
                        orderColumn: data.order?.[0]?.column ?? 0,
                        orderDir: data.order?.[0]?.dir ?? "asc"
                    };

                    console.log("2️⃣ PARAMÈTRES ENVOYÉS :", params);

                    const result =
                        await InscriptionController.getAll(params);

                    console.log("3️⃣ RÉPONSE CONTROLLER :", result);

                    const inscriptions =
                        Array.isArray(result?.data)
                            ? result.data
                            : Object.values(result?.data || {});

                    console.log("4️⃣ INSCRIPTIONS :", inscriptions);

                    const rows = inscriptions.map((item, index) => {

                        const candidat = item.candidat || {};
                        const listeInscriptions = item.inscriptions || [];

                        const preview =
                            listeInscriptions
                                .slice(0, 2)
                                .map(i => `
                        <div>
                            <b>${i.concours?.nom || "-"}</b>
                        </div>
                    `)
                                .join("");

                        const autres =
                            listeInscriptions.length > 2
                                ? `
                        <span class="badge badge-info">
                            +${listeInscriptions.length - 2} autres
                        </span>
                    `
                                : "";

                        return [
                            params.start + index + 1,

                            `${candidat.nom || ""} ${candidat.prenom || ""}`,

                            `${preview}${autres}`,

                            `<button
                    class="btn btn-info btn-sm btn-detail-candidat"
                    data-id="${candidat.id_candidat}">
                    <i class="fa fa-eye"></i>
                </button>`
                        ];
                    });

                    console.log("5️⃣ LIGNES DATATABLE :", rows);

                    callback({
                        draw: result?.draw ?? data.draw,
                        recordsTotal: result?.recordsTotal ?? 0,
                        recordsFiltered: result?.recordsFiltered ?? 0,
                        data: rows
                    });

                    console.log("6️⃣ CALLBACK DATATABLE APPELÉ");

                } catch (error) {

                    console.error(
                        "❌ ERREUR DATATABLE INSCRIPTIONS :",
                        error
                    );

                    callback({
                        draw: data.draw,
                        recordsTotal: 0,
                        recordsFiltered: 0,
                        data: []
                    });
                }
            },

            columns: [

                {
                    title: "#",

                    className: "text-center",

                    orderable: false,

                    searchable: false
                },

                {
                    title: "Candidat",

                    className: "text-center"
                },

                {
                    title: "Concours",

                    className: "text-center"
                },

                {
                    title: "Détails",

                    className: "text-center",

                    orderable: false,

                    searchable: false
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

    static initEvents() {

        document.addEventListener("click", async (e) => {

            // ===== DETAIL CANDIDAT =====
            const btnDetail = e.target.closest(".btn-detail-candidat");

            if (btnDetail) {
                await this.showDetailCandidat(btnDetail.dataset.id);
                return;
            }

            // ===== EDIT INSCRIPTION =====
            const btnEdit = e.target.closest(".btn-edit-inscription");

            if (btnEdit) {
                await this.openEditModal(btnEdit);
                return;
            }
        });


        document.getElementById("btnSaveInscription")
            .addEventListener("click", async () => {
                await this.saveInscription();
            });
    }

    static async showDetailCandidat(idCandidat) {

        const token = AdminController.getToken();

        const res = await InscriptionModel.getAllInscriptions(token);

        const candidats = Object.values(res.data.data);

        const candidat = candidats.find(
            c => c.candidat.id_candidat === idCandidat
        );

        if (!candidat) {
            Swal.fire("Erreur", "Candidat introuvable", "error");
            return;
        }

        const details = await Promise.all(
            candidat.inscriptions.map(ins =>
                InscriptionModel.detailInscription(token, ins.id_inscription)
            )
        );

        const concoursHTML = details.map(r => {

            const d = r.data.data;

            console.log("DETAIL INSCRIPTION", d);
            console.log("DIPLOMES :", d.diplomes);

            const diplomesHTML = d.diplomes?.length
                ? d.diplomes.map((diplome, index) => `
            <a
                href="${diplome.url}"
                target="_blank"
                rel="noopener noreferrer"
                class="d-block mb-1"
            >
                <i class="fa-solid fa-file-pdf text-danger mr-1"></i>
                Diplôme ${index + 1}
            </a>
        `).join("")
                : "-";

            return `
        <tr>
            <td>${d.concours?.nom || "-"}</td>

            <td>
                ${d.concours?.categorie?.libelle || "-"}
            </td>

            <td>
                ${d.centre?.nom || "-"}
            </td>

            <td>
                ${diplomesHTML}
            </td>

            <td>
                ${d.statut_inscription || "-"}
            </td>

            <td>
                ${d.date_inscription
                    ? new Date(d.date_inscription).toLocaleDateString()
                    : "-"
                }
            </td>

            <td>
                <button
                    class="btn btn-warning btn-sm btn-edit-inscription"
                    data-id="${d.id_inscription}"
                    data-statut="${d.statut_inscription}"
                    data-centre="${d.centre?.id_centre || ""}">
                    <i class="fa fa-edit"></i>
                </button>
            </td>

            <td>
                <button
                    class="btn btn-danger btn-sm btn-delete-inscription"
                    data-id="${d.id_inscription}">
                    <i class="fa fa-trash"></i>
                </button>
            </td>
        </tr>
    `;
        }).join("");



        document.getElementById("detailContent").innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <p><strong>Nom :</strong> ${candidat.candidat.nom}</p>
                <p><strong>Prénom :</strong> ${candidat.candidat.prenom}</p>
                <p><strong>Email :</strong> ${candidat.candidat.email}</p>
                <p><strong>Téléphone :</strong> ${candidat.candidat.telephone || '-'}</p>
            </div>

             <div class="col-md-6">

                <p>
                    <strong>Type :</strong>
                    ${candidat.candidat.type_candidat || '-'}
                </p>

                <p>
                <strong>Statut :</strong>
                    ${candidat.candidat.statut_compte || '-'}
                </p>

                <p>
                    <strong>CNIB :</strong>
                    ${candidat.candidat.numero_cnib || '-'}
                </p>

                <p>
                    <strong>Lieu naissance :</strong>
                    ${candidat.candidat.lieu_naissance || '-'}
                </p>

         </div>

        </div>

        <hr>
        <div class="table-responsive">
        <table class="table table-bordered table-striped">
            <thead>
                <tr>
                    <th>Concours</th>
                    <th>Catégorie</th>
                    <th>Centre</th>
                    <th>Diplôme</th>
                    <th>Statut</th>
                    <th>Date</th>
                    <th>Modifier</th>
                    <th>Supprimer</th>
                </tr>
            </thead>
            <tbody>${concoursHTML}</tbody>
        </table>
        </div>
    `;

        $("#detailInscriptionModal").modal("show");

    }

    static async openEditModal(btn) {

        const idInscription = btn.dataset.id;
        const statut = btn.dataset.statut;
        const idCentre = btn.dataset.centre;

        console.log({
            idInscription,
            statut,
            idCentre
        });

        $("#edit_id_inscription").val(idInscription);

        // statut
        $("#edit_statut").val(statut);

        const token = AdminController.getToken();
        const centres = await CentreModel.getAllCentres(token);

        const selectCentre = $("#edit_centre");

        selectCentre.empty();

        centres.data.data.forEach(c => {

            selectCentre.append(`
            <option value="${c.id_centre}">
                ${c.nom}
            </option>
        `);
        });

        // Préselection du centre
        selectCentre.val(String(idCentre)).trigger("change");

        $("#editInscriptionModal").modal("show");
    }


    static async saveInscription() {

        const token = AdminController.getToken();

        const id_inscription = $("#edit_id_inscription").val();
        const status_inscriptions = $("#edit_statut").val();
        const id_centre = $("#edit_centre").val();

        await InscriptionModel.updateStatut(token, {
            id_inscription,
            status_inscriptions
        });

        await InscriptionModel.updateCentre(token, {
            id_inscription,
            id_centre
        });

        Swal.fire("Succès", "Modification enregistrée", "success");

        $("#editInscriptionModal").modal("hide");

        await this.loadInscriptions();
    }

    static initDeleteInscription() {

        document.addEventListener("click", async (e) => {

            const btn = e.target.closest(".btn-delete-inscription");
            if (!btn) return;
            console.log("BOUTON CLIQUÉ");
            const id_inscription = btn.dataset.id;
            console.log("ID =", id_inscription);

            const result = await Swal.fire({
                title: "Supprimer l'inscription ?",
                text: "Cette action est irréversible",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Oui",
                cancelButtonText: "Annuler"
            });

            if (!result.isConfirmed) return;

            try {

                const token = AdminController.getToken();

                const res = await InscriptionModel.deleteInscription(
                    token,
                    id_inscription
                );
                console.log("REPONSE API :", res);

                if (!res.ok) {

                    Swal.fire(
                        "Erreur",
                        res.data.error || "Suppression impossible",
                        "error"
                    );

                    return;
                }

                Swal.fire(
                    "Succès",
                    "Inscription supprimée avec succès",
                    "success"
                );

                $("#detailInscriptionModal").modal("hide");

                await InscriptionController.loadInscriptions();

            } catch (error) {

                console.error(error);

                Swal.fire(
                    "Erreur",
                    "Une erreur est survenue",
                    "error"
                );
            }
        });
    }


    static async loadCentresByConcours(id_concours) {

        const token = AdminController.getToken();

        const res =
            await InscriptionModel.getCentresByConcours(
                token,
                id_concours
            );

        const select = $("#id_centre");

        select.empty();

        select.append(
            `<option value="">Sélectionnez un centre</option>`
        );

        res.data.forEach(data => {

            console.log("DATA", data)
            select.append(`
            <option value="${data.id_centre}">
                ${data.nom}
            </option>
        `);

        });

        select.trigger("change.select2");
    }


}
