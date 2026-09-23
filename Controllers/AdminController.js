import AdminModel from "../models/AdminModel.js";

export default class AdminController {

    static getToken() {
        return localStorage.getItem("admin_token");
    }

    static saveToken(token) {
        localStorage.setItem("admin_token", token);
    }

    static logout() {

        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin");

        window.location.href = "../login.php";
    }

    static checkAuth() {
        const token = this.getToken();

        if (!token) {
            window.location.href = "../login.php";
        }

        return token;
    }

    static initRegister() {

        const form = document.getElementById("registerForm");

        if (!form) return;

        form.addEventListener("submit", async (e) => {

            e.preventDefault();

            const formData = new FormData(form);

            const data = {
                nom: formData.get("nom"),
                prenom: formData.get("prenom"),
                role: formData.get("role"),
                telephone: formData.get("telephone"),
                email: formData.get("email"),
                mot_de_passe: formData.get("mot_de_passe")
            };

            //console.log("DATA ENVOYEES :", data);

            await this.register(data);

        });
    }

    static async register(data) {

        const res = await AdminModel.register(data);

        //console.log("REPONSE REGISTER :", res);

        if (!res.ok) {

            Swal.fire({
                icon: "error",
                title: "Erreur",
                text: res.data?.error ||
                    "Erreur chargement candidats"
            });


            return;
        }

        window.location.href = "../login.php";

        return true;
    }

    static initLogin() {

        const form = document.getElementById("loginForm");

        if (!form) return;

        form.addEventListener("submit", async (e) => {

            e.preventDefault();

            const formData = new FormData(form);

            const email = formData.get("email");
            const password = formData.get("mot_de_passe");

            // console.log("LOGIN DATA :", {
            //     email,
            //     password
            // });

            await this.login(email, password);

        });
    }


    static async login(email, mot_de_passe) {
        const errorEl = document.getElementById("formError");

        errorEl.style.display = "none";
        errorEl.textContent = "";

        try {
            const res = await AdminModel.login({
                email,
                mot_de_passe
            });

            if (!res.ok) {
                errorEl.style.display = "block";
                errorEl.textContent =
                    res.data.error || "Erreur connexion";

                return false;
            }

            //const admin = res.data.admin;

            localStorage.setItem(
                "admin_token",
                res.data.token
            );

            // localStorage.setItem(
            //     "admin",
            //     JSON.stringify(admin)
            // );

            // localStorage.setItem(
            //     "id_admin",
            //     admin.id_admin
            // );

            window.location.href = "views/dashboard.php";

            return true;

        } catch (err) {
            console.error("Erreur login :", err);

            errorEl.style.display = "block";
            errorEl.textContent = "Erreur serveur";

            return false;
        }
    }

    static async loadDashboard() {

        const token = this.checkAuth();

        const res = await AdminModel.getDashboard(token);

        if (!res.ok) {
            Swal.fire({
                icon: "error",
                title: "Erreur",
                text: res.data?.error ||
                    "Erreur chargement dashboard"
            });

            return;
        }

        return res.data;
    }

    static async getAll(params) {

        const token = AdminController.getToken();

        if (!token) {
            console.warn("Aucun token administrateur");

            return {
                draw: params?.draw ?? 0,
                recordsTotal: 0,
                recordsFiltered: 0,
                data: []
            };
        }

        const res =
            await AdminModel.getAllAdmins(
                token,
                params
            );

        // console.log(
        //     "RÉPONSE API ADMINS :",
        //     res
        // );

        if (!res.ok) {

            Swal.fire({
                icon: "error",
                title: "Erreur",
                text:
                    res.data?.error ||
                    "Impossible de charger les administrateurs"
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

    static loadAdmins() {

        // console.log(
        //     "INITIALISATION DATATABLE ADMINS"
        // );

        this.initDataTable();
    }

    static initDataTable() {

        if ($.fn.DataTable.isDataTable("#adminTable")) {
            // console.log(
            //     "DataTable admins déjà initialisé"
            // );
            return;
        }

        $("#adminTable").DataTable({

            processing: true,
            serverSide: true,

            searchDelay: 500,

            pageLength: 10,

            lengthMenu: [
                [10, 25, 50, 100],
                [10, 25, 50, 100]
            ],

            ajax: async function (data, callback) {

                try {

                    const params = {
                        draw: data.draw,
                        start: data.start,
                        length: data.length,
                        search: data.search?.value || ""
                    };

                    const result =
                        await AdminController.getAll(
                            params
                        );

                    const admins =
                        Array.isArray(result?.data)
                            ? result.data
                            : [];


                    const rows = admins.map(
                        (admin, index) => {

                            return [
                                params.start +
                                index +
                                1,

                                admin.nom || "-",

                                admin.prenom || "-",

                                admin.role || "-",

                                admin.email || "-",

                                admin.telephone || "-",

                                admin.date_creation
                                    ? new Date(
                                        admin.date_creation
                                    ).toLocaleDateString(
                                        "fr-FR"
                                    )
                                    : "-",

                                `
                            <button
                                class="btn btn-warning btn-sm btn-update-admin"
                                data-id="${admin.id}"
                                data-nom="${admin.nom || ""}"
                                data-prenom="${admin.prenom || ""}"
                                data-role="${admin.role || ""}">
                                <i class="fa fa-edit"></i>
                            </button>
                            `,

                                `
                            <button
                                class="btn btn-danger btn-sm btn-delete-admin"
                                data-id="${admin.id}">
                                <i class="fa fa-trash"></i>
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
                    console.log(error);

                    callback({
                        draw: data.draw,
                        recordsTotal: 0,
                        recordsFiltered: 0,
                        data: []
                    });

                    Swal.fire({
                        icon: "error",
                        title: "Erreur",
                        text:
                            "Impossible de charger les administrateurs"
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
                    title: "Nom",
                    className: "text-center"
                },

                {
                    title: "Prénom",
                    className: "text-center"
                },

                {
                    title: "Rôle",
                    className: "text-center"
                },

                {
                    title: "Email",
                    className: "text-center"
                },

                {
                    title: "Téléphone",
                    className: "text-center"
                },

                {
                    title: "Date de création",
                    className: "text-center"
                },

                {
                    title: "Modifier",
                    className: "text-center",
                    orderable: false,
                    searchable: false
                },

                {
                    title: "Supprimer",
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
                    // {
                    //     buttons: [
                    //         "copy",
                    //         "excel",
                    //         "csv",
                    //         "pdf"
                    //     ]
                    // }
                ],

                topEnd: "search",

                bottomStart: "info",

                bottomEnd: "paging"
            }
        });
    }

    static initCreateAdmin() {

        const form = document.getElementById("adminForm");

        if (!form) {
            console.error("adminForm introuvable dans le DOM");
            return;
        }

        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const token = AdminController.getToken();

            const data = {
                nom: document.getElementById("nom").value,
                prenom: document.getElementById("prenom").value,
                email: document.getElementById("email").value,
                telephone: document.getElementById("telephone").value,
                mot_de_passe: document.getElementById("mot_de_passe").value,
                role: document.getElementById("role").value
            };

            const res = await AdminModel.registerAdmin(token, data);

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
                res.data.message,
                "success"
            );
            form.reset();

            $("#ajouter_admin").modal("hide");

            this.initDataTable();
        });
    }

    static initDeleteAdmin() {

        document.addEventListener("click", async (e) => {

            const btn = e.target.closest(".btn-delete-admin");

            if (!btn) return;

            const id_admin = btn.dataset.id;

            // console.log("ID ADMIN =", id_admin);

            const result = await Swal.fire({
                title: "Supprimer cet administrateur ?",
                text: "Cette action est irréversible",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Supprimer",
                cancelButtonText: "Annuler"
            });

            if (!result.isConfirmed) return;

            const token = this.getToken();

            const res = await AdminModel.deleteAdmin(
                token,
                id_admin
            );

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
                res.data.message,
                "success"
            );

            await this.loadAdmins();
        });
    }

    static initEditAdmin() {

        document.addEventListener("click", (e) => {

            const btn = e.target.closest(".btn-update-admin");
            if (!btn) return;

            document.getElementById("edit_admin_id").value = btn.dataset.id;
            document.getElementById("edit_nom").value = btn.dataset.nom;
            document.getElementById("edit_prenom").value = btn.dataset.prenom;
            document.getElementById("edit_role").value = btn.dataset.role;

            $("#editAdminModal").modal("show");
        });
    }

    static initUpdateAdmin() {

        document.addEventListener("click", async (e) => {

            const btn = e.target.closest("#btn-update-admin");
            if (!btn) return;

            e.preventDefault();

            const token = AdminController.getToken();

            const id_admin = document.getElementById("edit_admin_id").value;

            const data = {
                nom: document.getElementById("edit_nom").value,
                prenom: document.getElementById("edit_prenom").value,
                role: document.getElementById("edit_role").value
            };

            //console.log("UPDATE DATA :", data);

            const res = await AdminModel.updateAdmin(token, id_admin, data);

            if (!res.ok) {
                Swal.fire("Erreur", res.data?.error || "Erreur update", "error");
                return;
            }

            Swal.fire("Succès", res.data.message, "success");

            $("#editAdminModal").modal("hide");

            await AdminController.loadAdmins();
        });
    }

    static initLogout() {

        document.addEventListener("click", (e) => {

            const btn = e.target.closest("#btnLogout");

            if (!btn) return;

            e.preventDefault();

            Swal.fire({
                title: "Déconnexion",
                text: "Voulez-vous vraiment vous déconnecter ?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Oui",
                cancelButtonText: "Annuler"
            }).then((result) => {

                if (result.isConfirmed) {

                    localStorage.removeItem("admin_token");
                    localStorage.removeItem("admin");

                    window.location.href = "../login.php";
                }

            });

        });
    }

    static async loadProfile() {

        const token = this.getToken();

        // const id_admin = localStorage.getItem("id_admin");

        if (!token) {
            Swal.fire("Erreur", "Administrateur introuvable", "error");
            return;
        }

        const res = await AdminModel.getProfile(
            token,
           // id_admin
        );

        if (!res.ok) {
            Swal.fire("Erreur", res.data.error, "error");
            return;
        }

        const admin = res.data.data;

        // document.getElementById("profil_nom").textContent =
        //     admin.nom;

        // document.getElementById("profil_prenom").textContent =
        //     admin.prenom;

        // document.getElementById("profil_role").textContent =
        //     admin.role;



        const nom = admin.nom || "";
        const prenom = admin.prenom || "";

        // initiales
        const initials = (nom.charAt(0) + prenom.charAt(0)).toUpperCase();

        // avatar
        document.getElementById("profileAvatar").textContent = initials;

        // infos header
        document.getElementById("adminNomComplet").textContent = `${nom} ${prenom}`;
        document.getElementById("adminRole").textContent = admin.role;

        // champs profil
        document.getElementById("profil_nom").textContent = nom;
        document.getElementById("profil_prenom").textContent = prenom;
        document.getElementById("profil_email").textContent = admin.email;
        document.getElementById("profil_tel").textContent = admin.telephone || "-";
        document.getElementById("profil_role").textContent = admin.role;
    }

    static initImportListe() {

        const boutons = document.querySelectorAll(".btn-upload-liste");
        const inputType = document.getElementById("typeListe");
        const inputFile = document.getElementById("fichierListe");
        const btnImporter = document.getElementById("btnImporterListe");

        if (!boutons.length || !inputType || !inputFile || !btnImporter) {
            return;
        }

        boutons.forEach(button => {

            button.addEventListener("click", () => {

                const type = button.dataset.type;

                inputType.value = type;
                inputFile.value = "";

                // console.log("Module sélectionné :", type);

            });

        });

        btnImporter.addEventListener("click", async () => {

            const token = this.getToken();
            const type = inputType.value;
            const file = inputFile.files[0];

            if (!type) {

                Swal.fire(
                    "Erreur",
                    "Le type de données est introuvable.",
                    "error"
                );

                return;
            }

            if (!file) {

                Swal.fire(
                    "Attention",
                    "Veuillez sélectionner un fichier.",
                    "warning"
                );

                return;
            }

            try {

                btnImporter.disabled = true;

                btnImporter.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin mr-1"></i>
                Importation...
            `;

                const res = await AdminModel.importExcel(
                    token,
                    type,
                    file
                );

                if (!res.ok) {

                    Swal.fire(
                        "Erreur",
                        res.data?.error ||
                        res.data?.message ||
                        "Erreur lors de l'importation.",
                        "error"
                    );

                    return;
                }

                await Swal.fire(
                    "Importation réussie",
                    res.data.message ||
                    "La liste a été importée avec succès.",
                    "success"
                );

                inputFile.value = "";

                $("#modalUploadListe").modal("hide");

                this.initDataTable();

            } catch (error) {

                // console.error("Erreur import liste :", error);

                Swal.fire(
                    "Erreur",
                    "Une erreur est survenue lors de l'importation.",
                    "error"
                );

            } finally {

                btnImporter.disabled = false;

                btnImporter.innerHTML = `
                <i class="fa-solid fa-upload mr-1"></i>
                Importer
            `;

            }

        });
    }


}

