<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>CANDIDATS</title>

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
    <!-- <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script> -->
    <?php include("inclusions_haut.php") ?>
</head>

<body id="page-top">

    <!-- Page Wrapper -->
    <div id="wrapper">

        <?php include("menu_admin.php") ?>

        <!-- Content Wrapper -->
        <div id="content-wrapper" class="d-flex flex-column">

            <!-- Main Content -->
            <div id="content">
                <div class="container-fluid">
                    <!-- Topbar -->
                    <?php include("entete.php") ?>

                    <!-- End of Topbar -->

                    <div class="header">
                        <div class="container-fluid">
                            <div class="header-body">
                                <div class="d-flex justify-content-between align-items-center mb-3">

                                    <div class="d-flex gap-2">

                                        <button
                                            type="button"
                                            class="btn btn-primary"
                                            data-toggle="modal"
                                            data-target="#ajouter_candidat">
                                            <i class="fa-solid fa-plus"></i>
                                            Ajouter un candidat
                                        </button>

                                        <button
                                            type="button"
                                            class="btn btn-success btn-upload-liste"
                                            data-type="candidat"
                                            data-toggle="modal"
                                            data-target="#modalUploadListe">
                                            <i class="fa-solid fa-file-excel"></i>
                                            Importer une liste
                                        </button>

                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col">
                            <div class="card">
                                <!-- Card header -->
                                <div class="card-header border-0">
                                    <h3 class="mb-0">Liste des candidats</h3>
                                </div>
                                <!-- Light table -->
                                <div class="table-responsive">
                                    <table class="table table-bordered table-striped" id="dataTable" width="100%" cellspacing="0">
                                        <thead>
                                            <tr>
                                                <th class="text-center">N°</th>
                                                <th class="text-center">Nom</th>
                                                <th class="text-center">Prénom(s)</th>
                                                <!-- <th class="text-center">Nom de jeune fille</th> -->
                                                <!-- <th class="text-center">Sexe</th>
                                                <th class="text-center">Date de naissance</th>
                                                <th class="text-center">Lieu de naissance</th>
                                                <th class="text-center">Pays de naissance</th> -->
                                                <th class="text-center">Numéro CNIB/ Pièce d'identité</th>
                                                <!-- <th class="text-center">Date de délivrance</th> -->
                                                <th class="text-center">Téléphone</th>
                                                <th class="text-center">Email</th>
                                                <!-- <th class="text-center">Emploi</th>
                                                <th class="text-center">Matricule</th>
                                                <th class="text-center">Ministère</th> -->
                                                <th class="text-center">Type de candidat</th>
                                                <th class="text-center">Modifier</th>
                                                <th class="text-center">Supprimer</th>
                                                <th class="text-center">Voir détails</th>
                                            </tr>
                                        </thead>
                                        <tfoot>
                                            <tr>
                                                <th class="text-center">N</th>
                                                <th class="text-center">Nom</th>
                                                <th class="text-center">Prénom(s)</th>
                                                <!-- <th class="text-center">Nom de jeune fille</th> -->
                                                <!-- <th class="text-center">Sexe</th>
                                                <th class="text-center">Date de naissance</th>
                                                <th class="text-center">Lieu de naissance</th>
                                                <th class="text-center">Pays de naissance</th> -->
                                                <th class="text-center">Numéro CNIB/ Pièce d'identité</th>
                                                <!-- <th class="text-center">Date de délivrance</th> -->
                                                <th class="text-center">Téléphone</th>
                                                <th class="text-center">Email</th>
                                                <!-- <th class="text-center">Emploi</th>
                                                <th class="text-center">Matricule</th>
                                                <th class="text-center">Ministère</th> -->
                                                <th class="text-center">Type de candidat</th>
                                                <th class="text-center">Modifier</th>
                                                <th class="text-center">Supprimer</th>
                                                <th class="text-center">Voir détails</th>
                                        </tfoot>

                                        <tbody id="candidatTableBody">

                                        </tbody>
                                    </table>
                                </div>
                                <!-- Card footer -->
                                <div class="card-footer py-4">

                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Footer -->
                    <?php include("footer.php") ?>
                </div>
            </div>

        </div>
        <!-- End of Main Content -->

    </div>
    <!-- End of Content Wrapper -->

    </div>
    <!-- End of Page Wrapper -->

    <!-- Scroll to Top Button-->
    <a class="scroll-to-top rounded" href="#page-top">
        <i class="fas fa-angle-up"></i>
    </a>

    <!-- Bootstrap core JavaScript-->
    <script src="../vendor/jquery/jquery.min.js"></script>
    <script src="../vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

    <!-- Core plugin JavaScript-->
    <script src="../vendor/jquery-easing/jquery.easing.min.js"></script>

    <!-- Custom scripts for all pages-->
    <script src="../js/sb-admin-2.min.js"></script>

    <!-- Page level plugins -->
    <script src="../vendor/datatables/jquery.dataTables.min.js"></script>
    <script src="../vendor/datatables/dataTables.bootstrap4.min.js"></script>

    <script src="https://cdn.datatables.net/2.3.2/js/dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/buttons/3.2.5/js/dataTables.buttons.min.js"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js"></script>

    <script src="https://cdn.datatables.net/buttons/3.2.5/js/buttons.html5.min.js"></script>
    <script src="https://cdn.datatables.net/buttons/3.2.5/js/buttons.print.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

    <?php include('modals/modal_candidat.php'); ?>
    <?php include('modals/modal_detail.php'); ?>
    <?php include('modals/modal_admin.php'); ?>


    <script type="module">
        import CandidatController from "../Controllers/CandidatController.js";
        import AdminController from "../Controllers/AdminController.js";
        document.addEventListener("DOMContentLoaded", () => {

            const token = AdminController.checkAuth();

            if (!token) {
                return;
            }

            CandidatController.initDataTable();
            CandidatController.getAll();
            CandidatController.registerCandidat();
            CandidatController.initDeleteButtons();
            CandidatController.initEditModal();
            CandidatController.initEditSubmit();
            CandidatController.initDetails();
            AdminController.initLogout();
            AdminController.initImportListe();
        });
    </script>



</body>

</html>