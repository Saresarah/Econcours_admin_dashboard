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

           // console.log("DATA INSCRIPTION :", data);

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

       // console.log("CANDIDATS :", res);

        const select = $("#id_candidat");

        select.empty();

        select.append(`<option value="">Sélectionnez un candidat</option>`);
       // console.log("Premier candidat :", res.data.data[0]);
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

          window.location.href = "../login.php";

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

        // console.log(
        //     "RÉPONSE API INSCRIPTIONS :",
        //     res
        // );

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
           // console.log("DataTable inscriptions déjà initialisé");
            return;
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

            ajax: async function (data, callback) {

                try {

                    const params = {
                        draw: data.draw,
                        start: data.start,
                        length: data.length,
                        search: data.search?.value || "",
                        orderColumn: data.order?.[0]?.column ?? 0,
                        orderDir: data.order?.[0]?.dir ?? "asc"
                    };

                    const result =
                        await InscriptionController.getAll(params);

                    const inscriptions =
                        Array.isArray(result?.data)
                            ? result.data
                            : Object.values(result?.data || {});

                    const rows = inscriptions.map(
                        (item, index) => {

                            const candidat =
                                item.candidat || {};

                            const listeInscriptions =
                                item.inscriptions || [];

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

                            const idsInscriptions =
                                listeInscriptions
                                    .map(i => i.id_inscription)
                                    .filter(Boolean)
                                    .join(",");

                            return [
                                params.start + index + 1,

                                `${candidat.nom || ""} ${candidat.prenom || ""}`,

                                `${preview}${autres}`,

                                `<button
                type="button"
                class="btn btn-info btn-sm btn-detail-candidat"
                data-ids="${idsInscriptions}"
                title="Voir détail">
                <i class="fa fa-eye"></i>
            </button>`
                            ];
                        }
                    );

                    callback({
                        draw: data.draw,
                        recordsTotal: result?.recordsTotal ?? 0,
                        recordsFiltered: result?.recordsFiltered ?? 0,
                        data: rows
                    });

                } catch (error) {

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
                                    await InscriptionController.exportExcel();
                                }
                            },
                            {
                                text: '<i class="fa fa-file-word"></i> Word',
                                className: "btn-export-word",
                                action: async function () {
                                    await InscriptionController.exportWord();
                                }
                            },
                            {
                                text: '<i class="fa fa-file-pdf"></i> PDF',
                                className: "btn-export-pdf",
                                action: async function () {
                                    await InscriptionController.exportPDF();
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

    static initEvents() {

        document.addEventListener("click", async (e) => {

            // ===== DETAIL CANDIDAT =====
            $(document).on(
                "click",
                ".btn-detail-candidat",
                function () {

                    const idsInscriptions =
                        $(this)
                            .attr("data-ids")
                            .split(",")
                            .filter(Boolean);

                    // console.log(
                    //     "IDS INSCRIPTIONS :",
                    //     idsInscriptions
                    // );

                    InscriptionController.showDetailCandidat(
                        idsInscriptions
                    );
                }
            );

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

    static async showDetailCandidat(idsInscriptions) {

        const token = AdminController.getToken();

        if (!token) {
            Swal.fire({
                icon: "warning",
                title: "Session expirée",
                text: "Veuillez vous reconnecter."
            });
            window.location.href = "../login.php";
            return;
        }

        if (!idsInscriptions || idsInscriptions.length === 0) {
            Swal.fire({
                icon: "warning",
                title: "Aucune inscription",
                text: "Aucune inscription trouvée pour ce candidat."
            });
            return;
        }

        try {

            Swal.fire({
                title: "Chargement...",
                text: "Récupération des détails du candidat",
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            // console.log(
            //     "IDs inscriptions :",
            //     idsInscriptions
            // );

            const responses = await Promise.all(
                idsInscriptions.map(
                    idInscription =>
                        InscriptionModel.detailInscription(
                            token,
                            idInscription
                        )
                )
            );

            // console.log(
            //     "DETAILS INSCRIPTIONS :",
            //     responses
            // );

            Swal.close();

            const details = responses
                .filter(response => response.ok)
                .map(response => response.data?.data)
                .filter(Boolean);

            if (details.length === 0) {

                Swal.fire({
                    icon: "error",
                    title: "Erreur",
                    text: "Impossible de récupérer les détails des inscriptions."
                });

                return;
            }

            // Le candidat est présent dans chaque DetailInscription
            const candidat = details[0].candidat;

            // console.log(
            //     "CANDIDAT :",
            //     candidat
            // );

            const concoursHTML = details
                .map(d => {

                    const diplomesHTML =
                        d.diplomes?.length
                            ? d.diplomes
                                .map(
                                    (diplome, index) => `
                                    <a
                                        href="${diplome.url}"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="d-block mb-1"
                                    >
                                        <i class="fa-solid fa-file-pdf text-danger me-1"></i>
                                        Diplôme ${index + 1}
                                    </a>
                                `
                                )
                                .join("")
                            : "-";

                   // console.log("INSCRIPTION D :", d);

                    return `
                    <tr>

                        <td>
                            ${d.concours?.nom || "-"}
                        </td>

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
                            <span class="badge bg-info">
                                ${d.statut_inscription || "-"}
                            </span>
                        </td>

                        <td>
                            ${d.date_inscription
                            ? new Date(
                                d.date_inscription
                            ).toLocaleDateString("fr-FR")
                            : "-"
                        }
                        </td>

                        <td class="text-center">

                            <button
    class="btn btn-warning btn-sm btn-edit-inscription"
    data-id="${d.id_inscription}"
    data-statut="${d.statut_inscription || ""}"
    data-centre="${d.centre?.id_centre || ""}"
    data-concours="${d.concours?.id_concours || ""}"
    title="Modifier"
>
    <i class="fa fa-edit"></i>
</button>

                        </td>

                        <td class="text-center">

                            <button
                                class="btn btn-danger btn-sm btn-delete-inscription"
                                data-id="${d.id_inscription}"
                                title="Supprimer"
                            >
                                <i class="fa fa-trash"></i>
                            </button>

                        </td>

                    </tr>
                `;
                })
                .join("");

            document.getElementById(
                "detailContent"
            ).innerHTML = `

            <div class="row">

                <div class="col-md-6">

                    <p>
                        <strong>Nom :</strong>
                        ${candidat.nom || "-"}
                    </p>

                    <p>
                        <strong>Prénom :</strong>
                        ${candidat.prenom || "-"}
                    </p>

                    <p>
                        <strong>Email :</strong>
                        ${candidat.email || "-"}
                    </p>

                </div>

                <div class="col-md-6">

                    <p>
                        <strong>Type :</strong>
                        ${candidat.type_candidat || "-"}
                    </p>

                    <p>
                        <strong>Lieu de naissance :</strong>
                        ${candidat.lieu_naissance || "-"}
                    </p>

                    <p>
                        <strong>ID candidat :</strong>
                        ${candidat.id_candidat || "-"}
                    </p>

                </div>

            </div>

            <hr>

            <h5 class="mb-3">
                <i class="fa fa-file-signature"></i>
                Inscriptions du candidat
            </h5>

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

                    <tbody>
                        ${concoursHTML}
                    </tbody>

                </table>

            </div>
        `;

            $("#detailInscriptionModal").modal("show");

        } catch (error) {

            console.error(
                "Erreur détail candidat :",
                error
            );

            Swal.close();

            Swal.fire({
                icon: "error",
                title: "Erreur",
                text: "Une erreur est survenue lors du chargement du candidat."
            });
        }
    }

    static async openEditModal(btn) {

        const idInscription =
            btn.dataset.id;

        const statut =
            btn.dataset.statut;

        const idCentre =
            btn.dataset.centre;

        const idConcours =
            btn.dataset.concours;



        // console.log({
        //     idInscription,
        //     statut,
        //     idCentre,
        //     idConcours
        // });

        if (!idConcours) {
            Swal.fire({
                icon: "error",
                title: "Erreur",
                text: "Le concours de cette inscription est introuvable."
            });
            return;
        }

        $("#edit_id_inscription")
            .val(idInscription);

        $("#edit_statut")
            .val(statut);

        await InscriptionController.loadCentresByConcours(
            idConcours,
            "#edit_centre"
        );

        $("#edit_centre")
            .val(String(idCentre))
            .trigger("change.select2");

        $("#editInscriptionModal")
            .modal("show");
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

        await this.getAll();
    }

    static initDeleteInscription() {

        document.addEventListener("click", async (e) => {

            const btn = e.target.closest(".btn-delete-inscription");
            if (!btn) return;
           // console.log("BOUTON CLIQUÉ");
            const id_inscription = btn.dataset.id;
           // console.log("ID =", id_inscription);

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
               // console.log("REPONSE API :", res);

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

                await InscriptionController.getAll();

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


    // static async loadCentresByConcours(id_concours) {

    //     const token = AdminController.getToken();

    //     const res =
    //         await InscriptionModel.getCentresByConcours(
    //             token,
    //             id_concours
    //         );

    //     const select = $("#id_centre");

    //     select.empty();

    //     select.append(
    //         `<option value="">Sélectionnez un centre</option>`
    //     );

    //     res.data.forEach(data => {

    //         console.log("DATA", data)
    //         select.append(`
    //         <option value="${data.id_centre}">
    //             ${data.nom}
    //         </option>
    //     `);

    //     });

    //     select.trigger("change.select2");
    // }

    static async loadCentresByConcours(
        id_concours,
        selectId = "#id_centre"
    ) {
        const token = AdminController.getToken();

        const res =
            await InscriptionModel.getCentresByConcours(
                token,
                id_concours
            );

       // console.log("CENTRES RECUS :", res);

        const select = $(selectId);

        select.empty();

        select.append(
            `<option value="">Sélectionnez un centre</option>`
        );

        if (!Array.isArray(res.data)) {
            console.error(
                "Les centres reçus ne sont pas un tableau :",
                res.data
            );
            return false;
        }

        res.data.forEach(data => {

           // console.log("DATA :", data);

            select.append(`
            <option value="${data.id_centre}">
                ${data.nom}
            </option>
        `);
        });

        select.trigger("change.select2");

        return true;
    }

    static async downloadExport(type) {
        const token = AdminController.getToken();

        if (!token) {
            Swal.fire({
                icon: "warning",
                title: "Session expirée",
                text: "Veuillez vous reconnecter."
            });

            window.location.href = "../login.php";

            return;
        }

        try {
            Swal.fire({
                title: "Export en cours...",
                text: `Préparation du fichier ${type.toUpperCase()}.`,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            let res;
            let extension;

            switch (type) {
                case "excel":
                    res = await InscriptionModel.exportExcel(token);
                    extension = "xlsx";
                    break;

                case "word":
                    res = await InscriptionModel.exportWord(token);
                    extension = "docx";
                    break;

                case "pdf":
                    res = await InscriptionModel.exportPDF(token);
                    extension = "pdf";
                    break;
            }

            if (!res.ok) {
                Swal.close();

                Swal.fire({
                    icon: "error",
                    title: "Erreur",
                    text: `Impossible d'exporter les inscriptions en ${type.toUpperCase()}.`
                });

                return;
            }

            const url = window.URL.createObjectURL(
                res.blob
            );

            const link = document.createElement("a");

            link.href = url;
            link.download =
                `inscriptions_${new Date().toISOString().slice(0, 10)}.${extension}`;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

            Swal.close();

            Swal.fire({
                icon: "success",
                title: "Export terminé",
                text: `Toutes les inscriptions ont été exportées en ${type.toUpperCase()}.`,
                timer: 2000,
                showConfirmButton: false
            });

        } catch (error) {
            console.error(
                `Erreur export ${type} inscriptions :`,
                error
            );

            Swal.close();

            Swal.fire({
                icon: "error",
                title: "Erreur",
                text: "Une erreur est survenue pendant l'export."
            });
        }
    }

    static async exportExcel() {
        await this.downloadExport("excel");
    }

    static async exportWord() {
        await this.downloadExport("word");
    }

    static async exportPDF() {
        await this.downloadExport("pdf");
    }

}
