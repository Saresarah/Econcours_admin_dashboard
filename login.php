<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Connexion administrateur - E-CONCOURS</title>

    <link rel="stylesheet" href="pages/assets/css/style.css">
    <link rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>

<body class="admin-login-page">

    <main class="admin-login-main">

        <div class="admin-login-container">

            <!-- PARTIE IDENTITÉ -->
            <section class="admin-login-brand">

                <div class="admin-login-logo">
                    <img src="pages/assets/image/armoiries-1.png"
                        alt="Armoiries du Burkina">
                </div>

                <div class="admin-login-brand-text">
                    <span class="admin-login-country">
                        RÉPUBLIQUE DU MALI
                    </span>

                    <span class="admin-login-divider"></span>

                    <h1>E-CONCOURS</h1>

                    <p>
                        Plateforme de gestion des concours
                    </p>
                </div>

                <div class="admin-login-brand-footer">
                    <i class="fa-solid fa-shield-halved"></i>
                    <span>Accès sécurisé à l'espace d'administration</span>
                </div>

            </section>


            <!-- CARTE DE CONNEXION -->
            <section class="admin-login-card">

                <div class="admin-login-header">

                    <div class="admin-login-icon">
                        <i class="fa-solid fa-user-shield"></i>
                    </div>

                    <div>
                        <p class="admin-login-eyebrow">
                            ESPACE ADMINISTRATION
                        </p>

                        <h2>
                            Connexion
                        </h2>

                        <p class="admin-login-subtitle">
                            Connectez-vous pour accéder à votre espace de gestion.
                        </p>
                    </div>

                </div>


                <form class="admin-login-form" id="loginForm">

                    <!-- EMAIL -->
                    <div class="admin-form-group">

                        <label for="email">
                            Adresse e-mail
                        </label>

                        <div class="admin-input-wrapper">

                            <i class="fa-solid fa-envelope"></i>

                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="votre@email.com"
                                autocomplete="email"
                                required>

                        </div>

                    </div>


                    <!-- MOT DE PASSE -->
                    <div class="admin-form-group">

                        <div class="admin-label-row">
                            <label for="password">
                                Mot de passe
                            </label>
                        </div>

                        <div class="admin-input-wrapper">

                            <i class="fa-solid fa-lock"></i>

                            <input
                                type="password"
                                id="password"
                                name="mot_de_passe"
                                placeholder="Votre mot de passe"
                                autocomplete="current-password"
                                required>

                            <button
                                type="button"
                                class="admin-toggle-password"
                                onclick="togglePassword()"
                                aria-label="Afficher ou masquer le mot de passe">

                                <i class="fa-solid fa-eye"></i>

                            </button>

                        </div>

                    </div>


                    <!-- MESSAGE ERREUR -->
                    <p id="formError" class="admin-form-error"></p>


                    <!-- BOUTON -->
                    <button
                        type="submit"
                        class="admin-login-button">

                        <span>Se connecter</span>

                        <i class="fa-solid fa-arrow-right"></i>

                    </button>

                </form>


                <!-- SÉCURITÉ -->
                <div class="admin-login-security">

                    <i class="fa-solid fa-shield-halved"></i>

                    <div>
                        <strong>Connexion sécurisée</strong>
                        <span>
                            Vos informations sont protégées.
                        </span>
                    </div>

                </div>

            </section>

        </div>

    </main>


    <script>
        function togglePassword() {

            const password = document.getElementById("password");
            const button = document.querySelector(".admin-toggle-password i");

            if (password.type === "password") {

                password.type = "text";

                button.classList.remove("fa-eye");
                button.classList.add("fa-eye-slash");

            } else {

                password.type = "password";

                button.classList.remove("fa-eye-slash");
                button.classList.add("fa-eye");

            }
        }
    </script>


    <script type="module">
        import AdminController from "./Controllers/AdminController.js";

        document.addEventListener("DOMContentLoaded", () => {

            AdminController.initLogin();

        });
    </script>

</body>

</html>