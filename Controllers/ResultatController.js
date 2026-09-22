import ResultatModel from "../models/ResultatModel.js";
import ConcoursModel from "../models/ConcoursModel.js";
import AdminController from "./AdminController.js";

export default class ResultatController {

    static async init() {

        await this.initDataTable();

    }

    static async getAll(params = {}) {

        const token =
            AdminController.getToken();

        if (!token) {

           window.location.href = "../login.php";

            return {
                draw:
                    params.draw ?? 0,

                recordsTotal: 0,

                recordsFiltered: 0,

                data: []
            };
        }

        const res =
            await ResultatModel.getAllResultats(
                token,
                params
            );

        // console.log(
        //     "REPONSE API RESULTATS :",
        //     res
        // );

        if (!res.ok) {

            Swal.fire({
                icon: "error",

                title: "Erreur",

                text:
                    res.data?.error ||
                    res.data?.message ||
                    "Impossible de charger les résultats"
            });

            return {
                draw:
                    params.draw ?? 0,

                recordsTotal: 0,

                recordsFiltered: 0,

                data: []
            };
        }

        return {
            draw:
                res.data?.draw ??
                params.draw ??
                0,

            recordsTotal:
                res.data?.recordsTotal ?? 0,

            recordsFiltered:
                res.data?.recordsFiltered ?? 0,

            data:
                Array.isArray(res.data?.data)
                    ? res.data.data
                    : []
        };
    }

    static async initDataTable() {

        // console.log(
        //     "INITIALISATION DATATABLE RESULTATS"
        // );

        const table =
            $("#dataTable");

        if (!table.length) {

            console.error(
                "Table résultats introuvable"
            );

            return;
        }

        if (
            $.fn.DataTable.isDataTable(
                "#dataTable"
            )
        ) {

            table
                .DataTable()
                .destroy();
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

            searchDelay: 500,

            ajax: async function (
                data,
                callback
            ) {

                try {

                    const params = {

                        draw:
                            data.draw,

                        start:
                            data.start,

                        length:
                            data.length,

                        search:
                            data.search?.value ||
                            "",

                        orderColumn:
                            data.order?.[0]?.column ??
                            0,

                        orderDir:
                            data.order?.[0]?.dir ??
                            "desc"
                    };

                    // console.log(
                    //     "PARAMETRES RESULTATS :",
                    //     params
                    // );

                    const result =
                        await ResultatController.getAll(
                            params
                        );

                    // console.log(
                    //     "RESULTAT CONTROLLER :",
                    //     result
                    // );

                    const resultats =
                        Array.isArray(
                            result?.data
                        )
                            ? result.data
                            : [];

                  //  console.log("RESULTATS RECUS :", resultats);

                    const lignes = resultats.map((item, index) => {

                        const concours = item.concours || {};

                        // console.log("ITEM RESULTAT :", item);
                        // console.log("ID CONCOURS :", item.id_concours);

                        return [
                            params.start + index + 1,

                            `
            <strong>
                ${concours.nom || "-"}
            </strong>

            ${concours.annee
                                ? `
                        <br>
                        <small class="text-muted">
                            ${concours.annee}
                        </small>
                    `
                                : ""
                            }
        `,

                            `
            <span class="badge badge-info">
                ${Array.isArray(item.resultats)
                                ? item.resultats.length
                                : 0
                            }

                résultat${Array.isArray(item.resultats) &&
                                item.resultats.length > 1
                                ? "s"
                                : ""
                            }
            </span>
        `,

                            `
            <button
                type="button"
                class="btn btn-primary btn-sm btn-afficher-resultats"
                data-id="${item.id_concours}"
                title="Afficher les résultats"
            >
                <i class="fas fa-eye"></i>
                Afficher
            </button>
        `
                        ];
                    });

                    callback({

                        draw:
                            result?.draw ??
                            data.draw,

                        recordsTotal:
                            result?.recordsTotal ??
                            0,

                        recordsFiltered:
                            result?.recordsFiltered ??
                            0,

                        data:
                            lignes
                    });

                } catch (error) {

                    console.error(
                        "ERREUR DATATABLE RESULTATS :",
                        error
                    );

                    callback({

                        draw:
                            data.draw,

                        recordsTotal:
                            0,

                        recordsFiltered:
                            0,

                        data: []
                    });
                }
            },

            columns: [

                {
                    title: "#",

                    className:
                        "text-center",

                    orderable:
                        false,

                    searchable:
                        false
                },

                {
                    title: "Concours",

                    className:
                        "text-center"
                },

                {
                    title: "Nombre de résultats",

                    className:
                        "text-center",

                    orderable:
                        false,

                    searchable:
                        false
                },

                {
                    title: "Actions",

                    className:
                        "text-center",

                    orderable:
                        false,

                    searchable:
                        false
                }

            ],

            language: {

                url:
                    "https://cdn.datatables.net/plug-ins/1.13.7/i18n/fr-FR.json"
            },

            layout: {

                topStart: [
                    "pageLength",
                ],

                topEnd:
                    "search",

                bottomStart:
                    "info",

                bottomEnd:
                    "paging"
            },

            drawCallback:
                function () {

                    ResultatController
                        .initButtons();
                }
        });
    }
    static initButtons() {

        $(document)
            .off("click", ".btn-afficher-resultats")
            .on("click", ".btn-afficher-resultats", function () {

                const idConcours =
                    $(this).attr("data-id");

                // console.log(
                //     "ID CONCOURS CLIQUÉ :",
                //     idConcours
                // );

                if (!idConcours || idConcours === "undefined") {

                    Swal.fire({
                        icon: "error",
                        title: "Erreur",
                        text: "Impossible de récupérer l'identifiant du concours."
                    });

                    return;
                }

                window.location.href =
                    `details_resultats.php?id_concours=${encodeURIComponent(idConcours)}`;
            });
    }

    static async initDetails() {

        // console.log(
        //     "INITIALISATION DETAILS RESULTATS"
        // );

        const params =
            new URLSearchParams(
                window.location.search
            );

        const idConcours =
            params.get("id_concours");
      //  console.log("ID CONCOURS DETAILS :", idConcours)

        if (!idConcours) {

            console.error(
                "ID concours absent de l'URL"
            );

            Swal.fire({
                icon: "error",
                title: "Erreur",
                text:
                    "Aucun concours sélectionné."
            });

            return;
        }

        // console.log(
        //     "ID CONCOURS :",
        //     idConcours
        // );

        const table =
            $("#dataTable");

        if (!table.length) {

            console.error(
                "Table détails résultats introuvable"
            );

            return;
        }

        const token =
            AdminController.getToken();

        if (!token) {

            Swal.fire({
                icon: "warning",
                title: "Session expirée",
                text:
                    "Veuillez vous reconnecter."
            });

            window.location.href = "../login.php";

            return;
        }

        if (
            $.fn.DataTable.isDataTable(
                "#dataTable"
            )
        ) {

            table
                .DataTable()
                .destroy();
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

            searchDelay: 500,

            ajax: async function (
                data,
                callback
            ) {

                try {

                    const params = {

                        draw:
                            data.draw,

                        start:
                            data.start,

                        length:
                            data.length,

                        search:
                            data.search?.value ||
                            "",

                        orderColumn:
                            data.order?.[0]?.column ??
                            0,

                        orderDir:
                            data.order?.[0]?.dir ??
                            "asc"
                    };

                    // console.log(
                    //     "PARAMETRES DETAILS :",
                    //     params
                    // );

                    const response =
                        await ResultatModel.detailResultat(
                            token,
                            idConcours,
                            params
                        );

                    // console.log(
                    //     "REPONSE DETAIL RESULTAT :",
                    //     response
                    // );

                    if (!response.ok) {

                        callback({

                            draw:
                                data.draw,

                            recordsTotal:
                                0,

                            recordsFiltered:
                                0,

                            data: []
                        });

                        return;
                    }

                    const result =
                        response.data || {};

                    const resultats =
                        Array.isArray(
                            result.data
                        )
                            ? result.data
                            : [];

                    const rows =
                        resultats.map(
                            (
                                resultat,
                                index
                            ) => {

                                const candidat =
                                    resultat.candidat ||
                                    {};

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

                                const statut =
                                    resultat.moyenne != null
                                        ? Number(
                                            resultat.moyenne
                                        ) >= 10
                                            ? "REUSSI"
                                            : "NON REUSSI"
                                        : "-";

                                return [

                                    data.start +
                                    index +
                                    1,

                                    candidat.nom ||
                                    "-",

                                    candidat.prenom ||
                                    "-",

                                    noteCg,

                                    noteSp,

                                    `
                                    <strong>
                                        ${moyenne}
                                    </strong>
                                `,

                                    `
                                    <span class="badge ${statut === "REUSSI"
                                        ? "badge-success"
                                        : statut === "NON REUSSI"
                                            ? "badge-danger"
                                            : "badge-secondary"
                                    }">
                                        ${statut}
                                    </span>
                                `,

                                    `
                                    <button
                                        type="button"
                                        class="btn btn-info btn-sm"
                                        disabled
                                    >
                                        <i class="fas fa-file-alt"></i>
                                        Afficher
                                    </button>
                                `,

                                    `
                                    <button
                                        type="button"
                                        class="btn btn-success btn-sm"
                                        disabled
                                    >
                                        <i class="fas fa-file-alt"></i>
                                        Afficher
                                    </button>
                                `
                                ];
                            }
                        );

                    callback({

                        draw:
                            result.draw ??
                            data.draw,

                        recordsTotal:
                            result.recordsTotal ??
                            0,

                        recordsFiltered:
                            result.recordsFiltered ??
                            0,

                        data:
                            rows
                    });

                } catch (error) {

                    console.error(
                        "ERREUR DETAILS RESULTATS :",
                        error
                    );

                    callback({

                        draw:
                            data.draw,

                        recordsTotal:
                            0,

                        recordsFiltered:
                            0,

                        data: []
                    });
                }
            },

            columns: [

                {
                    title: "#",

                    className:
                        "text-center",

                    orderable:
                        false,

                    searchable:
                        false
                },

                {
                    title: "Nom",

                    className:
                        "text-center"
                },

                {
                    title: "Prénom",

                    className:
                        "text-center"
                },

                {
                    title: "Note culture générale",

                    className:
                        "text-center"
                },

                {
                    title: "Note matière spécifique",

                    className:
                        "text-center"
                },


                {
                    title: "Moyenne générale",

                    className:
                        "text-center"
                },

                {
                    title: "Statut",

                    className:
                        "text-center",

                    orderable:
                        false,

                    searchable:
                        false
                },

                {
                    title: "Copie originale",

                    className:
                        "text-center",

                    orderable:
                        false,

                    searchable:
                        false
                },

                {
                    title: "Copie corrigée",

                    className:
                        "text-center",

                    orderable:
                        false,

                    searchable:
                        false
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
                                text: '<i class="fas fa-file-excel me-1"></i> Excel',
                                className: "btn btn-success",
                                action: async function () {

                                    await ResultatController.exportResultat(
                                        idConcours,
                                        "excel"
                                    );
                                }
                            },

                            {
                                text: '<i class="fas fa-file-word me-1"></i> Word',
                                className: "btn btn-primary",
                                action: async function () {

                                    await ResultatController.exportResultat(
                                        idConcours,
                                        "word"
                                    );
                                }
                            },

                            {
                                text: '<i class="fas fa-file-pdf me-1"></i> PDF',
                                className: "btn btn-danger",
                                action: async function () {

                                    await ResultatController.exportResultat(
                                        idConcours,
                                        "pdf"
                                    );
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
    static async exportResultat(
        idConcours,
        format
    ) {
        try {

            const token =
                AdminController.getToken();

            if (!token) {

                Swal.fire({
                    icon: "warning",
                    title: "Session expirée",
                    text:
                        "Veuillez vous reconnecter."
                });
                window.location.href = "../login.php";

                return;
            }

            const blob =
                await ResultatModel.exportResultat(
                    token,
                    idConcours,
                    format
                );

            const url =
                window.URL.createObjectURL(blob);

            const link =
                document.createElement("a");

            link.href = url;

            const extension =
                format === "excel"
                    ? "xlsx"
                    : format === "word"
                        ? "docx"
                        : "pdf";

            link.download =
                `resultats_${idConcours}.${extension}`;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (error) {

            console.error(
                "Erreur export résultats :",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Erreur",
                text:
                    "Impossible de générer le fichier."
            });
        }
    }
}