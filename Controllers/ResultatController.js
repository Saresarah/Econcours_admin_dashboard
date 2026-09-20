import ResultatModel from "../models/ResultatModel.js";
import ConcoursModel from "../models/ConcoursModel.js";
import AdminController from "./AdminController.js";

export default class ResultatController {

    static async init() {

        await this.initDataTable();

    }

    static async getAll(page = 1, limit = 10) {

        const token = AdminController.getToken();

        if (!token) {
            console.warn("Aucun token administrateur");

            return {
                data: [],
                page: 1,
                limit: 10,
                total: 0,
                totalPages: 0
            };
        }

        const res = await ResultatModel.getAllResultats(
            token,
            page,
            limit
        );

        console.log("REPONSE API RESULTATS :", res);

        if (!res.ok) {

            console.error(
                res.data?.error || "Erreur chargement résultats"
            );

            Swal.fire({
                icon: "error",
                title: "Erreur",
                text: res.data?.error ||
                    "Impossible de charger les résultats"
            });

            return {
                data: [],
                page: 1,
                limit: 10,
                total: 0,
                totalPages: 0
            };
        }

        let resultats = [];

        if (Array.isArray(res.data?.data)) {

            resultats = res.data.data;

        } else if (res.data?.resultat) {

            try {

                resultats = JSON.parse(res.data.resultat);

            } catch (error) {

                console.error(
                    "ERREUR PARSING RESULTATS :",
                    error
                );

                resultats = [];
            }
        }

        console.log(
            "RESULTATS NORMALISES :",
            resultats
        );

        return {
            page: res.data?.page || page,
            limit: res.data?.limit || limit,
            total: res.data?.total || resultats.length,
            totalPages:
                res.data?.totalPages ||
                Math.ceil(resultats.length / limit),
            data: resultats
        };
    }


    static async initDataTable() {

        console.log("INITIALISATION DATATABLE RESULTATS");

        const table = $("#dataTable");

        if (!table.length) {
            console.error("Table résultats introuvable");
            return;
        }

        if ($.fn.DataTable.isDataTable("#dataTable")) {
            table.DataTable().destroy();
        }

        table.DataTable({

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
            ajax: async function (data, callback) {

                try {

                    const token = AdminController.getToken();

                    if (!token) {
                        console.error("Aucun token administrateur");

                        callback({
                            draw: data.draw,
                            recordsTotal: 0,
                            recordsFiltered: 0,
                            data: []
                        });

                        return;
                    }

                    const start = data.start || 0;
                    const length = data.length || 10;

                    const page =
                        Math.floor(start / length) + 1;

                    console.log("PAGE DEMANDEE :", page);
                    console.log("LIMIT :", length);

                    const result =
                        await ResultatController.getAll(
                            page,
                            length
                        );

                    console.log(
                        "REPONSE RESULTAT CONTROLLER :",
                        result
                    );

                    const resultats = Array.isArray(result.data)
                        ? result.data
                        : [];

                    console.log(
                        "RESULTATS EXTRAITS :",
                        resultats
                    );

                    if (!resultats.length) {

                        console.warn(
                            "Aucun résultat pour cette page"
                        );

                        callback({
                            draw: data.draw,
                            recordsTotal: result.total || 0,
                            recordsFiltered: result.total || 0,
                            data: []
                        });

                        return;
                    }

                    const concoursIds = [
                        ...new Set(
                            resultats
                                .map(resultat =>
                                    Number(resultat.id_concours)
                                )
                                .filter(id =>
                                    !isNaN(id)
                                )
                        )
                    ];

                    console.log(
                        "ID CONCOURS TROUVES :",
                        concoursIds
                    );

                    const concoursMap = {};

                    let pageConcours = 1;
                    let totalPagesConcours = 1;

                    while (
                        pageConcours <= totalPagesConcours
                    ) {

                        const concoursResponse =
                            await ConcoursModel.getAllConcours(
                                token,
                                pageConcours,
                                10
                            );

                        console.log(
                            `CONCOURS PAGE ${pageConcours} :`,
                            concoursResponse
                        );

                        if (!concoursResponse.ok) {

                            console.error(
                                "Erreur récupération concours"
                            );

                            break;
                        }

                        const concoursData =
                            concoursResponse.data || {};

                        const concours =
                            Array.isArray(concoursData.data)
                                ? concoursData.data
                                : [];

                        concours.forEach(concoursItem => {

                            const id =
                                Number(
                                    concoursItem.id_concours
                                );

                            if (!isNaN(id)) {
                                concoursMap[id] =
                                    concoursItem;
                            }

                        });

                        totalPagesConcours =
                            Number(
                                concoursData.totalPages ||
                                concoursData.total_pages ||
                                1
                            );

                        const tousTrouves =
                            concoursIds.every(
                                id => concoursMap[id]
                            );

                        if (tousTrouves) {
                            break;
                        }

                        pageConcours++;
                    }

                    console.log(
                        "CONCOURS MAP :",
                        concoursMap
                    );

                    const concoursAvecResultats =
                        concoursIds
                            .map(id => concoursMap[id])
                            .filter(Boolean);

                    console.log(
                        "CONCOURS AVEC RESULTATS :",
                        concoursAvecResultats
                    );

                    const lignes =
                        concoursAvecResultats.map(
                            (concours, index) => {

                                return [

                                    start + index + 1,

                                    concours.nom || "-",

                                    `
                        <button
                            type="button"
                            class="btn btn-primary btn-sm btn-afficher-resultats"
                            data-id="${concours.id_concours}">
                            <i class="fas fa-eye"></i>
                            Afficher
                        </button>
                        `
                                ];
                            }
                        );

                    console.log(
                        "LIGNES DATATABLE :",
                        lignes
                    );

                    callback({

                        draw: data.draw,

                        recordsTotal:
                            result.total || resultats.length,

                        recordsFiltered:
                            result.total || resultats.length,

                        data: lignes

                    });

                } catch (error) {

                    console.error(
                        "ERREUR DATATABLE RESULTATS :",
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
                    className: "text-center"
                },

                {
                    title: "Concours",
                    className: "text-center"
                },

                {
                    title: "Actions",
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

            },

            drawCallback: function () {

                ResultatController.initButtons();

            }

        });
    }

    static initButtons() {

        document.addEventListener(
            "click",
            (e) => {

                const btn =
                    e.target.closest(
                        ".btn-afficher-resultats"
                    );

                if (!btn) return;

                const idConcours =
                    btn.dataset.id;

                window.location.href =
                    `details_resultats.php?id_concours=${idConcours}`;

            }
        );

    }

    static async initDetails() {

        console.log("INITIALISATION DETAILS RESULTATS");

        const params =
            new URLSearchParams(window.location.search);

        const idConcours =
            params.get("id_concours");

        if (!idConcours) {

            console.error(
                "ID concours absent de l'URL"
            );

            Swal.fire({
                icon: "error",
                title: "Erreur",
                text: "Aucun concours sélectionné."
            });

            return;
        }

        console.log(
            "ID CONCOURS :",
            idConcours
        );

        const response =
            await this.getAll(1, 100);

        console.log(
            "REPONSE TOUS LES RESULTATS :",
            response
        );

        const resultats =
            Array.isArray(response?.data)
                ? response.data
                : [];

        console.log(
            "TOUS LES RESULTATS :",
            resultats
        );

        const resultatsConcours =
            resultats.filter(resultat =>
                Number(resultat.id_concours) ===
                Number(idConcours)
            );

        console.log(
            "RESULTATS DU CONCOURS :",
            resultatsConcours
        );

        const tbody =
            document.querySelector(
                "#dataTable tbody"
            );

        if (!tbody) {

            console.error(
                "tbody détails résultats introuvable"
            );

            return;
        }

        tbody.innerHTML = "";

        const token =
            AdminController.getToken();

        let concoursInfo = null;

        let pageConcours = 1;

        let totalPagesConcours = 1;

        while (
            pageConcours <=
            totalPagesConcours
        ) {

            const concoursResponse =
                await ConcoursModel.getAllConcours(
                    token,
                    pageConcours,
                    10
                );

            console.log(
                `CONCOURS PAGE ${pageConcours} :`,
                concoursResponse
            );

            if (!concoursResponse.ok) {
                break;
            }

            const concoursData =
                concoursResponse.data;

            const concours =
                concoursData?.data || [];

            totalPagesConcours =
                concoursData?.totalPages || 1;

            concoursInfo =
                concours.find(
                    c =>
                        Number(c.id_concours) ===
                        Number(idConcours)
                );

            if (concoursInfo) {
                break;
            }

            pageConcours++;
        }

        console.log(
            "CONCOURS POUR DETAILS :",
            concoursInfo
        );

        const nomConcours =
            document.getElementById(
                "nomConcours"
            );

        if (nomConcours) {

            nomConcours.textContent =
                concoursInfo?.nom ||
                "Concours";
        }

        if (resultatsConcours.length === 0) {

            tbody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center">
                    Aucun résultat disponible pour ce concours.
                </td>
            </tr>
        `;

            return;
        }

        resultatsConcours.forEach(
            (resultat, index) => {

                const noteSp =
                    resultat.note_sp != null
                        ? Number(
                            resultat.note_sp
                        ).toFixed(2)
                        : "-";

                const noteCg =
                    resultat.note_cg != null
                        ? Number(
                            resultat.note_cg
                        ).toFixed(2)
                        : "-";

                const moyenne =
                    resultat.moyenne != null
                        ? Number(
                            resultat.moyenne
                        ).toFixed(2)
                        : "-";

                const tr =
                    document.createElement("tr");

                tr.innerHTML = `
                <td class="text-center">
                    ${index + 1}
                </td>

                <td>
                    ${resultat.candidat?.nom ?? "-"}
                </td>

                <td>
                    ${resultat.candidat?.prenom ?? "-"}
                </td>

                <td class="text-center">
                    ${noteSp}
                </td>

                <td class="text-center">
                    ${noteCg}
                </td>

                <td class="text-center">
                    <strong>
                        ${moyenne}
                    </strong>
                </td>

                <td class="text-center">
                    ${resultat.statut ?? "-"}
                </td>

                <td class="text-center">
                    <button
                        type="button"
                        class="btn btn-info btn-sm btn-copie-originale"
                        disabled>
                        <i class="fas fa-file-alt"></i>
                        Afficher
                    </button>
                </td>

                <td class="text-center">
                    <button
                        type="button"
                        class="btn btn-success btn-sm btn-copie-corrigee"
                        disabled>
                        <i class="fas fa-file-alt"></i>
                        Afficher
                    </button>
                </td>
            `;

                tbody.appendChild(tr);
            }
        );

        if (
            $.fn.DataTable.isDataTable(
                "#dataTable"
            )
        ) {

            $("#dataTable")
                .DataTable()
                .destroy();
        }

        $("#dataTable").DataTable({

            responsive: true,

            paging: true,

            pageLength: 10,

            lengthMenu: [
                [10, 25, 50, 100],
                [10, 25, 50, 100]
            ],

            searching: true,

            ordering: true,

            info: true,

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

}