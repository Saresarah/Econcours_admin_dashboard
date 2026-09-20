import PaiementModel from "../models/PaiementModel.js";
import AdminController from "./AdminController.js";

export default class PaiementController {



    static async getAll(params) {

        const token = AdminController.getToken();

        if (!token) {

            console.warn(
                "Aucun token administrateur"
            );

            return {
                draw: params?.draw ?? 0,
                recordsTotal: 0,
                recordsFiltered: 0,
                data: []
            };
        }

        const res =
            await PaiementModel.getAllPaiements(
                token,
                params
            );

        console.log(
            "RÉPONSE API PAIEMENTS :",
            res
        );

        if (!res.ok) {

            Swal.fire({
                icon: "error",
                title: "Erreur",
                text:
                    res.data?.error ||
                    "Impossible de charger les paiements"
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

    static loadPaiementsByCandidat() {


        this.initPaiementDataTable();
    }

    static initPaiementDataTable() {

        if ($.fn.DataTable.isDataTable("#paiementTable")) {

            console.log(
                "DataTable paiements déjà initialisé"
            );

            return;
        }

        $("#paiementTable").DataTable({

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

                        search:
                            data.search?.value || "",

                        orderColumn:
                            data.order?.[0]?.column ?? 0,

                        orderDir:
                            data.order?.[0]?.dir ?? "desc"
                    };

                    const result =
                        await PaiementController.getAll(
                            params
                        );

                    const paiements =
                        Array.isArray(result?.data)
                            ? result.data
                            : [];

                    const rows =
                        paiements.map(
                            (item, index) => {

                                const candidat =
                                    item.inscription?.candidat || {};

                                const concours =
                                    item.inscription?.concours || {};

                                const montant =
                                    Number(item.montant || 0);

                                return [

                                    params.start +
                                    index +
                                    1,

                                    `
                                ${candidat.nom || ""}
                                ${candidat.prenom || ""}
                                `,

                                    `
                                ${concours.nom || "-"}
                                ${concours.annee
                                        ? `(${concours.annee})`
                                        : ""}
                                `,

                                    `
                                <strong>
                                    ${montant.toLocaleString("fr-FR")}
                                    FCFA
                                </strong>
                                `,

                                    item.mode_paiement || "-",

                                    item.statut_paiement || "-",

                                    item.date_paiement
                                        ? item.date_paiement
                                            .split("T")[0]
                                        : "-",

                                    `
                                <button
                                    class="btn btn-info btn-sm btn-detail-paiement"
                                    data-id="${candidat.id_candidat}">
                                    <i class="fa fa-eye"></i>
                                </button>
                                `
                                ];
                            }
                        );

                    callback({

                        draw: data.draw,

                        recordsTotal:
                            result?.recordsTotal ?? 0,

                        recordsFiltered:
                            result?.recordsFiltered ?? 0,

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
                    title: "Montant",
                    className: "text-center"
                },

                {
                    title: "Mode de paiement",
                    className: "text-center"
                },

                {
                    title: "Statut",
                    className: "text-center"
                },

                {
                    title: "Date",
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
                            {
                                text: '<i class="fa fa-file-excel"></i> Excel',
                                className: "btn-export-excel",
                                action: async function () {
                                    await PaiementController.exportExcel();
                                }
                            },

                            {
                                text: '<i class="fa fa-file-word"></i> Word',
                                className: "btn-export-word",
                                action: async function () {
                                    await PaiementController.exportWord();
                                }
                            },

                            {
                                text: '<i class="fa fa-file-pdf"></i> PDF',
                                className: "btn-export-pdf",
                                action: async function () {
                                    await PaiementController.exportPDF();
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

    static initPaiementEvents() {

        document.body.addEventListener("click", async (e) => {

            const btn = e.target.closest(".btn-detail-paiement");

            if (!btn) return;

            console.log("CLICK DETECTÉ :", btn.dataset.id);

            await PaiementController.showPaiementDetail(btn.dataset.id);
        });
    }
    static currentPaiement = null;
    static async showPaiementDetail(idCandidat) {
        console.log("ID candidat :", idCandidat);

        const token = AdminController.getToken();

        const res = await PaiementModel.getPaiementDetail(token, idCandidat);

        console.log("Réponse API :", res);

        if (!res.ok) {
            Swal.fire("Erreur", "Impossible de charger les paiements", "error");
            return;
        }

        const paiements = res.data.data;

        console.log("Paiements :", paiements);

        if (!paiements || paiements.length === 0) {
            Swal.fire("Info", "Aucun paiement trouvé", "info");
            return;
        }

        PaiementController.currentPaiement = paiements[0].id_paiement;
        PaiementController.currentCandidat = idCandidat;
        // IMPORTANT : le candidat vient du premier paiement
        const candidat = paiements[0].inscription.candidat;

        let html = `
        <div class="row">

            <div class="col-md-6">
                <p><strong>Nom :</strong> ${candidat.nom}</p>
                <p><strong>Prénom :</strong> ${candidat.prenom}</p>
            </div>

            <div class="col-md-6">
                <p><strong>Email :</strong> ${candidat.email || "-"}</p>
                <p><strong>CNIB :</strong> ${candidat.numero_cnib || "-"}</p>
            </div>

        </div>

        <hr>

        <h5>Détail des paiements</h5>
        <div class="table-responsive">
        <table class="table table-bordered table-striped">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Concours</th>
                    <th>Montant</th>
                    <th>Date</th>
                    <th>Mode</th>
                    <th>Statut</th>
                </tr>
            </thead>
            <tbody>
            </div>
    `;

        paiements.forEach(p => {

            html += `
            <tr data-id="${p.id_paiement}">
                <td>${p.id_paiement}</td>
                <td>${p.inscription.concours.nom}</td>
                <td>${Number(p.montant).toLocaleString()} FCFA</td>
                <td>${new Date(p.date_paiement).toLocaleString()}</td>
                <td>${p.mode_paiement || "-"}</td>
                <td>
                    <select class="form-control statut-select">
                        <option value="ATTENTE" ${p.statut_paiement === "ATTENTE" ? "selected" : ""}>ATTENTE</option>
                        <option value="REUSSI" ${p.statut_paiement === "REUSSI" ? "selected" : ""}>REUSSI</option>
                        <option value="ECHOUE" ${p.statut_paiement === "ECHOUE" ? "selected" : ""}>ECHOUE</option>
                    </select>
                </td>
        
            </tr>
        `;
        });

        html += `</tbody></table>`;

        document.getElementById("detailPaiementContent").innerHTML = html;

        console.log("Avant ouverture modal");

        $("#detailPaiementModal").modal("show");

        console.log("Après ouverture modal");
    }

    static initPaiementStatusInlineEdit() {

        document.addEventListener("change", async (e) => {

            const select = e.target.closest(".statut-select");
            if (!select) return;

            const row = select.closest("tr");
            const id_paiement = row.dataset.id;

            const token = AdminController.getToken();

            const statut_paiement = select.value;

            // 1. update visuel immédiat
            // PaiementController.updateSelectColor(select);

            // 2. update backend
            const res = await PaiementModel.updatePaiementStatus(
                token,
                id_paiement,
                PaiementController.currentCandidat,
                statut_paiement
            );

            if (!res.ok) {
                Swal.fire("Erreur", "Modification échouée", "error");
                return;
            }

            // 3. feedback léger
            Swal.fire({
                icon: "success",
                title: "Statut mis à jour",
                timer: 800,
                showConfirmButton: false
            });
            select.classList.remove(
                "border-success",
                "border-warning",
                "border-danger"
            );

            if (select.value === "REUSSI") {
                select.classList.add("border-success");
            }

            else if (select.value === "ECHOUE") {
                select.classList.add("border-danger");
            }

            else {
                select.classList.add("border-warning");
            }

            select.style.transition = "0.2s";
            select.style.transform = "scale(1.05)";

            setTimeout(() => {
                select.style.transform = "scale(1)";
            }, 150);
        });

    }

    static async downloadExport(type) {
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
            const filters = {
                statut_paiement:
                    document.getElementById("filterStatutPaiement")?.value || "",

                mode_paiement:
                    document.getElementById("filterModePaiement")?.value || ""
            };

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
                    res = await PaiementModel.exportExcel(token, filters);
                    extension = "xlsx";
                    break;

                case "word":
                    res = await PaiementModel.exportWord(token, filters);
                    extension = "docx";
                    break;

                case "pdf":
                    res = await PaiementModel.exportPDF(token, filters);
                    extension = "pdf";
                    break;

                default:
                    Swal.close();

                    Swal.fire({
                        icon: "error",
                        title: "Erreur",
                        text: "Type d'export invalide."
                    });

                    return;
            }

            if (!res.ok) {
                Swal.close();

                Swal.fire({
                    icon: "error",
                    title: "Erreur",
                    text: `Impossible d'exporter les paiements en ${type.toUpperCase()}.`
                });

                return;
            }

            const url = window.URL.createObjectURL(res.blob);

            const link = document.createElement("a");

            link.href = url;

            link.download =
                `paiements_${new Date().toISOString().slice(0, 10)}.${extension}`;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

            Swal.close();

            Swal.fire({
                icon: "success",
                title: "Export terminé",
                text: `Les paiements ont été exportés en ${type.toUpperCase()}.`,
                timer: 2000,
                showConfirmButton: false
            });

        } catch (error) {
            console.error(`Erreur export ${type} paiements :`, error);

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