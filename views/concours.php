<!DOCTYPE html>
<html lang="fr">

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">


    <title>Liste des concours</title>

    <!-- Custom fonts for this template -->
    <link href="../vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
    <link
        href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i"
        rel="stylesheet">

    <!-- Custom styles for this template -->
    <link href="../css/sb-admin-2.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../pages/assets/css/style.css">

    <!-- Custom styles for this page -->
    <link href="../vendor/datatables/dataTables.bootstrap4.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.datatables.net/2.3.2/css/dataTables.dataTables.min.css">
    <link rel="stylesheet" href="https://cdn.datatables.net/buttons/3.2.5/css/buttons.dataTables.min.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
    <?php include("inclusions_haut.php") ?>

</head>

<body id="page-top">

    <div id="wrapper">

        <!-- Sidebar -->
        <?php include("menu_admin.php") ?>

        <div id="content-wrapper" class="d-flex flex-column">

            <div id="content">

                <!-- Topbar -->
                <?php include("entete.php") ?>

                <div class="container-fluid">

                    <!-- HEADER -->
                    <div class="header">
                        <div class="container-fluid">
                            <div class="header-body">
                                <div class="d-flex justify-content-between align-items-center mb-3">

                                    <div class="d-flex gap-2">

                                        <button
                                            type="button"
                                            class="btn btn-primary"
                                            data-toggle="modal"
                                            data-target="#ajouter_concours">
                                            <i class="fa-solid fa-plus"></i>
                                            Ajouter un concours
                                        </button>
                                        <button
                                            type="button"
                                            class="btn btn-success btn-upload-liste"
                                            data-type="concours"
                                            data-toggle="modal"
                                            data-target="#modalUploadListe">
                                            <i class="fa-solid fa-file-excel"></i>
                                            Importer une liste
                                        </button>

                                    </div>

                                </div>

                            </div>
                        </div>

                        <!-- TABLE -->
                        <div class="card shadow mb-4">

                            <div class="card-header py-3">
                                <h3 class="mb-0 ">
                                    Liste des concours
                                </h3>
                            </div>

                            <div class="card-body">

                                <div class="table-responsive">

                                    <table
                                        class="table table-bordered table-striped"
                                        id="dataTable"
                                        width="100%"
                                        cellspacing="0">

                                        <thead class="thead-light">

                                            <tr>

                                                <th class="text-center">N°</th>

                                                <th class="text-center">
                                                    Nom
                                                </th>

                                                <th class="text-center">
                                                    Type
                                                </th>

                                                <th class="text-center">
                                                    Catégorie
                                                </th>

                                                <th class="text-center">
                                                    Postes
                                                </th>

                                                <th class="text-center">
                                                    Début
                                                </th>

                                                <th class="text-center">
                                                    Fin
                                                </th>

                                                <th class="text-center">
                                                    Statut
                                                </th>

                                                <th class="text-center">
                                                    Modifier
                                                </th>

                                                <th class="text-center">
                                                    Supprimer
                                                </th>

                                                <th class="text-center">
                                                    Voir la liste des candidats
                                                </th>

                                                <th class="text-center">
                                                    Voir la liste des examens
                                                </th>


                                            </tr>

                                        </thead>

                                        <tbody id="concoursTableBody">

                                        </tbody>

                                    </table>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                <!-- Footer -->
                <?php include("footer.php") ?>

            </div>

        </div>

        <!-- Scroll -->
        <a class="scroll-to-top rounded" href="#page-top">
            <i class="fas fa-angle-up"></i>
        </a>

        <!-- JS -->
        <script src="../vendor/jquery/jquery.min.js"></script>

        <script src="../vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

        <script src="../vendor/jquery-easing/jquery.easing.min.js"></script>

        <script src="../js/sb-admin-2.min.js"></script>

        <!-- DataTables -->
        <script src="../vendor/datatables/jquery.dataTables.min.js"></script>

        <script src="../vendor/datatables/dataTables.bootstrap4.min.js"></script>



        <script src="https://cdn.datatables.net/2.3.2/js/dataTables.min.js"></script>
        <script src="https://cdn.datatables.net/buttons/3.2.5/js/dataTables.buttons.min.js"></script>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js"></script>

        <script src="https://cdn.datatables.net/buttons/3.2.5/js/buttons.html5.min.js"></script>
        <script src="https://cdn.datatables.net/buttons/3.2.5/js/buttons.print.min.js"></script>

        <?php include("modals/modal_concours.php"); ?>
        <?php include('modals/modal_admin.php'); ?>

        <!-- CONTROLLER -->
        <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
        <script type="module">
            import ConcoursController from "../Controllers/ConcoursController.js";
            import AdminController from "../Controllers/AdminController.js";
            document.addEventListener("DOMContentLoaded", async () => {
                // ConcoursController.getAll();
                const token = AdminController.checkAuth();

                if (!token) {
                    return;
                }
                ConcoursController.initDataTable();
                ConcoursController.initCreateConcours();
                ConcoursController.initEditConcours();
                ConcoursController.initDeleteConcours();
                ConcoursController.initSwitchStatus();
                ConcoursController.loadSelects();
                ConcoursController.initSelect2();
                AdminController.initImportListe();
                AdminController.initLogout();

            });
        </script>


</body>

</html>