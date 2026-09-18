<!DOCTYPE html>
<html lang="fr">

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>DÉTAILS DES RÉSULTATS</title>

    <link href="../vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
    <link
        href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,500,600,600,700,700i,800,800i,900,900i"
        rel="stylesheet">

    <link href="../css/sb-admin-2.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../pages/assets/css/style.css">

    <link href="../vendor/datatables/dataTables.bootstrap4.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.datatables.net/2.3.2/css/dataTables.dataTables.min.css">
    <link rel="stylesheet" href="https://cdn.datatables.net/buttons/3.2.5/css/buttons.dataTables.min.css">

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

    <?php include("inclusions_haut.php") ?>

</head>

<body id="page-top">

    <div id="wrapper">

        <?php include("menu_admin.php") ?>

        <div id="content-wrapper" class="d-flex flex-column">

            <div id="content">

                <div class="container-fluid">

                    <?php include("entete.php") ?>

                    <div class="header">
                        <div class="container-fluid">
                            <div class="header-body">
                                <div class="row align-items-center py-4">

                                    <div class="col-lg-8 col-md-8 col-7">

                                        <div class="d-flex align-items-center">

                                            <a
                                                href="resultat.php"
                                                class="btn btn-light btn-sm mr-3"
                                            >
                                                <i class="fas fa-arrow-left"></i>
                                                Retour
                                            </a>

                                            <div>
                                                <h6 class="h2 mb-0">
                                                    Résultats du concours
                                                </h6>
                                            </div>

                                        </div>

                                    </div>

                                    <div class="col-lg-4 col-md-4 col-5 text-right">

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row">

                        <div class="col">

                            <div class="card">

                                <div class="card-header border-0">

                                    <div class="d-flex justify-content-between align-items-center">

                                        <div>
                                            <h3 class="mb-1">
                                                Liste des candidats
                                            </h3>

                                            <p
                                                class="text-muted mb-0"
                                                id="nomConcours"
                                            >
                                                Chargement du concours...
                                            </p>
                                        </div>

                                    </div>

                                </div>

                                <div class="table-responsive">

                                    <table
                                        class="table"
                                        id="dataTable"
                                        width="100%"
                                        cellspacing="0"
                                    >

                                        <thead>

                                            <tr>

                                                <th class="text-center">
                                                    N°
                                                </th>

                                                <th class="text-center">
                                                    NOM
                                                </th>

                                                <th class="text-center">
                                                    PRÉNOM
                                                </th>

                                                <th class="text-center">
                                                    NOTE SPÉCIALITÉ
                                                </th>

                                                <th class="text-center">
                                                    NOTE CULTURE GÉNÉRALE
                                                </th>

                                                <th class="text-center">
                                                    MOYENNE GÉNÉRALE
                                                </th>

                                                <th class="text-center">
                                                    STATUT
                                                </th>

                                                <th class="text-center">
                                                    COPIE ORIGINALE
                                                </th>

                                                <th class="text-center">
                                                    COPIE CORRIGÉE
                                                </th>

                                            </tr>

                                        </thead>

                                        <tfoot>

                                            <tr>

                                                <th class="text-center">
                                                    N°
                                                </th>

                                                <th class="text-center">
                                                    NOM
                                                </th>

                                                <th class="text-center">
                                                    PRÉNOM
                                                </th>

                                                <th class="text-center">
                                                    NOTE SPÉCIALITÉ
                                                </th>

                                                <th class="text-center">
                                                    NOTE CULTURE GÉNÉRALE
                                                </th>

                                                <th class="text-center">
                                                    MOYENNE GÉNÉRALE
                                                </th>

                                                <th class="text-center">
                                                    STATUT
                                                </th>

                                                <th class="text-center">
                                                    COPIE ORIGINALE
                                                </th>

                                                <th class="text-center">
                                                    COPIE CORRIGÉE
                                                </th>

                                            </tr>

                                        </tfoot>

                                        <tbody>

                                        </tbody>

                                    </table>

                                </div>

                                <div class="card-footer py-4">

                                </div>

                            </div>

                        </div>

                    </div>

                    <?php include("footer.php") ?>

                </div>

            </div>

        </div>

    </div>

    <a
        class="scroll-to-top rounded"
        href="#page-top"
    >
        <i class="fas fa-angle-up"></i>
    </a>

    <script src="../vendor/jquery/jquery.min.js"></script>
    <script src="../vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

    <script src="../vendor/jquery-easing/jquery.easing.min.js"></script>

    <script src="../js/sb-admin-2.min.js"></script>

    <script src="../vendor/datatables/jquery.dataTables.min.js"></script>
    <script src="../vendor/datatables/dataTables.bootstrap4.min.js"></script>

    <script src="https://cdn.datatables.net/2.3.2/js/dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/buttons/3.2.5/js/dataTables.buttons.min.js"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js"></script>

    <script src="https://cdn.datatables.net/buttons/3.2.5/js/buttons.html5.min.js"></script>
    <script src="https://cdn.datatables.net/buttons/3.2.5/js/buttons.print.min.js"></script>

    <script type="module">
        import ResultatController
        from "../controllers/ResultatController.js";

        ResultatController.initDetails();
    </script>

</body>

</html>