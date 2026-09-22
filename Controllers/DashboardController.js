import DashboardModel from "../models/DashboardModel.js";
import AdminController from "./AdminController.js";

export default class DashboardController {

    static async loadDashboard() {

        const token = AdminController.getToken();

        if (!token) {

            window.location.href = "../login.php";

            return;
        }

        const res = await DashboardModel.dashboard(token);

        if (!res.ok) return;

        const data = res.data.data;

        const concours = data.candidabyconcours;

        let totalCandidats = 0;
        let totalPaiements = 0;

        concours.forEach(c => {

            totalCandidats += c.Nbinscri;
            totalPaiements += c.Nbpaye;

        });

        document.getElementById("totalCandidats").textContent =
            totalCandidats;

        document.getElementById("totalCandidat").textContent =
            data.totalCandidats;

        document.getElementById("totalPaiements").textContent =
            totalPaiements;

        document.getElementById("montantTotal").textContent =
            Number(data.montantTotalGlobal).toLocaleString() +
            " FCFA";

        // const tbody =
        //     document.getElementById("dashboardTableBody");

        // tbody.innerHTML = "";

        // concours.forEach(c => {

        //     tbody.innerHTML += `
        //     <tr>
        //         <td>${c.nom}</td>
        //         <td>${c.Nbinscri}</td>
        //         <td>${c.Nbpaye}</td>
        //     </tr>
        // `;
        // });

        this.renderChart(concours);
    }

    static renderChart(concours) {

        const ctx =
            document.getElementById("concoursChart");

        new Chart(ctx, {

            type: "line",

            data: {

                labels: concours.map(c => c.nom),

                datasets: [
                    {
                        label: "Nombre de candidats",
                        data: concours.map(c => c.Nbinscri),
                        backgroundColor: "#dfe8e2",
                    },
                    {
                        label: "Paiements réussis",
                        data: concours.map(c => c.Nbpaye),
                        backgroundColor: "#1d753a",
                    }
                ],
            },

            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    static async loadPieChart() {

        const token = AdminController.getToken();

        const res =
            await DashboardModel.getChartCirculaire(token);

        if (!res.ok) return;

        const data = res.data.data;

        const ctx =
            document.getElementById("candidatPieChart");

        new Chart(ctx, {

            type: "doughnut",

            data: {

                labels: [
                    "Cette semaine",
                    "Semaine passée",
                    "Anciennes inscriptions"
                ],

                datasets: [{
                    data: [
                        data.thisWeek,
                        data.lastWeek,
                        data.autres
                    ],

                    backgroundColor: [
                        "#28a745", // Vert = nouveaux
                        "#ffc107", // Jaune = récents
                        "#dc3545"  // Rouge = anciens
                    ],

                    borderWidth: 2,
                    borderColor: "#fff"
                }]
            },

            options: {

                responsive: true,
                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        position: "bottom"
                    }
                },

                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return context.label + " : " +
                                context.raw + " candidat(s)";
                        }
                    }
                }
            }

        });
        // console.log({
        //     total: data.total,
        //     thisWeek: data.thisWeek,
        //     lastWeek: data.lastWeek,
        //     autres: data.autres
        // });
    }



    // static setText(id, value) {
    //     const el = document.getElementById(id);
    //     if (el) el.innerText = value;
    // }

    // static async initDashboard() {

    //     const token = AdminController.getToken();

    //     const res = await DashboardModel.getDashboard(token);

    //     console.log("DASHBOARD :", res);

    //     if (!res.ok) {
    //         Swal.fire(
    //             "Erreur",
    //             "Impossible de charger le dashboard",
    //             "error"
    //         );
    //         return;
    //     }

    //     const data = res.data.data;

    //     // =========================
    //     // KPI SIMPLIFIÉS
    //     // =========================

    //     this.setText("nb_candidats", data.candidats.total);
    //     this.setText("nb_concours", data.concours.total);
    //     this.setText("nb_inscriptions_valides", data.inscriptions.valides);
    //     this.setText(
    //         "montant_total",
    //         (data.paiements.montant_total ?? 0) + " FCFA"
    //     );

    //     // ==== CHARTS =====

    //     // ==========================
    //     // CHART INSCRIPTIONS
    //     // ==========================

    //     const inscriptions = data.inscriptions.parJour || [];

    //     const labelsInscriptions = inscriptions.map(i =>
    //         new Date(i.date_inscription).toLocaleDateString()
    //     );

    //     const valuesInscriptions = inscriptions.map(i =>
    //         i._count?._all ?? 0
    //     );

    //     new Chart(document.getElementById("chartInscriptions"), {
    //         type: "line",
    //         data: {
    //             labels: labelsInscriptions,
    //             datasets: [{
    //                 label: "Inscriptions",
    //                 data: valuesInscriptions,
    //                 borderColor: "#4e73df",
    //                 backgroundColor: "rgba(78,115,223,0.1)",
    //                 tension: 0.3
    //             }]
    //         },
    //         options: {
    //             responsive: true,
    //             plugins: {
    //                 legend: {
    //                     display: true
    //                 }
    //             }
    //         }
    //     });


    //     // ==========================
    //     // CHART PAIEMENTS
    //     // ==========================

    //     const paiements = data.paiements.recents || [];

    //     const labelsPaiements = paiements.map(p =>
    //         p.date_paiement
    //             ? new Date(p.date_paiement).toLocaleDateString()
    //             : "N/A"
    //     );

    //     const valuesPaiements = paiements.map(p =>
    //         p.montant || 0
    //     );

    //     new Chart(document.getElementById("chartPaiements"), {
    //         type: "bar",
    //         data: {
    //             labels: labelsPaiements,
    //             datasets: [{
    //                 label: "Paiements",
    //                 data: valuesPaiements,
    //                 backgroundColor: "#1cc88a"
    //             }]
    //         },
    //         options: {
    //             responsive: true
    //         }
    //     });


    //     // ==========================
    //     // CHART CONCOURS
    //     // ==========================

    //     const concours = data.concours.parType || [];

    //     new Chart(document.getElementById("chartConcours"), {
    //         type: "doughnut",
    //         data: {
    //             labels: concours.map(c => c.type),
    //             datasets: [{
    //                 data: concours.map(c => c._count._all),
    //                 backgroundColor: [
    //                     "#4e73df",
    //                     "#1cc88a",
    //                     "#36b9cc",
    //                     "#f6c23e"
    //                 ]
    //             }]
    //         },
    //         options: {
    //             responsive: true
    //         }
    //     });
    // }

}