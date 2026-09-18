<div class="modal fade" id="ajouter_admin" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Ajout d'un nouvel admin</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form id="adminForm">
                <div class="modal-body">
                    <div class="form-group">
                        <div class="row">

                            <div class="col-md-4">
                                <label for="nom">Nom (*)</label>
                                <input id="nom" class="form-control" type="text" name="nom" placeholder="Entrer le nom " required>
                            </div>

                            <div class="col-md-4">
                                <label for="prenom">Prénom (s *)</label>
                                <input id="prenom" class="form-control" type="text" name="prenom" placeholder="Entrer le prénom" required>
                            </div>

                            <div class="col-md-4">
                                <label for="email">Email (*)</label>
                                <input id="email" class="form-control" type="email" name="email" placeholder="Entrer l'email" required>
                            </div>
                        </div>

                    </div>


                    <div class="form-group">
                        <div class="row">

                            <div class="col-md-4">
                                <label for="telephone">Téléphone</label>
                                <input id="telephone" class="form-control" type="text" name="telephone" placeholder="Entrer le téléphone" required>
                            </div>

                            <div class="col-md-4">
                                <label for="role">Rôle (*)</label>
                                <select id="role" class="form-control" name="role" required>
                                    <option value="SUPERADMIN"> Administrateur</option>
                                    <option value="GESTIONNAIRE">Gestionnaire</option>
                                </select>
                            </div>

                            <div class="col-md-4">
                                <label for="mot_de_passe">Mot de passe (*)</label>
                                <input id="mot_de_passe" class="form-control" type="password" name="mot_de_passe" placeholder="Entrer le mot de passe" required>
                            </div>
                        </div>

                    </div>

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Annuler</button>
                    <button type="submit" class="btn btn-primary">Enregistrer</button>
                </div>
            </form>
        </div>
    </div>
</div>
<div class="modal fade" id="editAdminModal" tabindex="-1">

    <div class="modal-dialog modal-lg">
        <div class="modal-content">

            <div class="modal-header">
                <h5>Modification d'un administrateur</h5>
                <button type="button" class="close" data-dismiss="modal">
                    <span>&times;</span>
                </button>
            </div>

            <form id="editAdminForm">

                <div class="modal-body">

                    <input type="hidden" id="edit_admin_id">

                    <label>Nom</label>
                    <input id="edit_nom" class="form-control mb-2">

                    <label>Prénom</label>
                    <input id="edit_prenom" class="form-control mb-2">

                    <label>Rôle</label>
                    <select id="edit_role" class="form-control">
                        <option value="SUPERADMIN">SUPERADMIN</option>
                        <option value="GESTIONNAIRE">GESTIONNAIRE</option>
                    </select>

                </div>

                <div class="modal-footer">

                    <button type="button" class="btn btn-secondary" data-dismiss="modal">
                        Annuler
                    </button>

                    <button type="button" id="btn-update-admin" class="btn btn-warning">
                        Enregistrer
                    </button>

                </div>

            </form>

        </div>
    </div>

</div>

<div
    class="modal fade"
    id="modalUploadListe"
    tabindex="-1"
    role="dialog"
    aria-labelledby="modalUploadListeLabel"
    aria-hidden="true">

    <div class="modal-dialog modal-lg modal-dialog-centered" role="document">

        <div class="modal-content">

            <div class="modal-header">

                <h5 class="modal-title" id="modalUploadListeLabel">
                    <i class="fa-solid fa-file-excel mr-2"></i>
                    Importer une liste
                </h5>

                <button
                    type="button"
                    class="close"
                    data-dismiss="modal"
                    aria-label="Fermer">

                    <span aria-hidden="true">&times;</span>

                </button>

            </div>

            <div class="modal-body">

                <div class="alert alert-primary">
                    <i class="fa-solid fa-circle-info mr-1"></i>
                    Sélectionnez un fichier Excel contenant la liste à importer.
                </div>

                <div class="form-group">

                    <label for="fichierListe">
                        Fichier Excel
                    </label>

                    <input
                        type="file"
                        id="fichierListe"
                        class="form-control"
                        accept=".xls,.xlsx,.xlsb,.xltx,.xltm,.csv">

                    <small class="form-text text-muted">
                        Formats acceptés : XLS, XLSX, XLSB, XLTX, XLTM et CSV.
                    </small>

                </div>

                <input
                    type="hidden"
                    id="typeListe">

            </div>

            <div class="modal-footer">

                <button
                    type="button"
                    class="btn btn-secondary"
                    data-dismiss="modal">
                    Annuler
                </button>

                <button
                    type="button"
                    class="btn btn-success"
                    id="btnImporterListe">

                    <i class="fa-solid fa-upload mr-1"></i>
                    Importer

                </button>

            </div>

        </div>

    </div>

</div>