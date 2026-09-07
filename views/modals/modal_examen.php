<div class="modal fade" id="ajouter_examen" tabindex="-1">

    <div class="modal-dialog modal-lg">

        <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title">
                    Ajouter un examen
                </h5>

                <button type="button"
                    class="close"
                    data-dismiss="modal">

                    <span>&times;</span>

                </button>
            </div>


            <form id="formExamen">

                <div class="modal-body">

                    <div class="row">

                        <!-- INTITULE -->
                        <div class="col-md-6">

                            <div class="form-group">

                                <label>Intitulé de l'examen</label>

                                <input
                                    type="text"
                                    class="form-control"
                                    id="intitule"
                                    required
                                >

                            </div>

                        </div>


                        <!-- TYPE EXAMEN -->
                        <div class="col-md-6">

                            <div class="form-group">

                                <label>Type d'examen</label>

                                <select
                                    class="form-control"
                                    id="type_examen"
                                    required
                                >

                                    <option value="">
                                        Sélectionner
                                    </option>

                                    <option value="ECRIT">
                                        Écrit
                                    </option>

                                    <option value="ORAL">
                                        Oral
                                    </option>

                                    <option value="PRATIQUE">
                                        Pratique
                                    </option>

                                </select>

                            </div>

                        </div>


                        <!-- COEFFICIENT -->
                        <div class="col-md-6">

                            <div class="form-group">

                                <label>Coefficient</label>

                                <input
                                    type="number"
                                    class="form-control"
                                    id="coefficient"
                                    required
                                >

                            </div>

                        </div>


                        <!-- DATE -->
                        <div class="col-md-6">

                            <div class="form-group">

                                <label>Date de l'examen</label>

                                <input
                                    type="date"
                                    class="form-control"
                                    id="date_examen"
                                    required
                                >

                            </div>

                        </div>


                        <!-- HEURE -->
                        <div class="col-md-6">

                            <div class="form-group">

                                <label>Heure</label>

                                <input
                                    type="time"
                                    class="form-control"
                                    id="heure"
                                    required
                                >

                            </div>

                        </div>


                        <!-- LIEU -->
                        <div class="col-md-6">

                            <div class="form-group">

                                <label>Lieu</label>

                                <input
                                    type="text"
                                    class="form-control"
                                    id="lieu"
                                    required
                                >

                            </div>

                        </div>


                        <!-- CONCOURS -->
                        <div class="col-md-12">

                            <div class="form-group">

                                <label>Concours</label>

                                <select
                                    class="form-control"
                                    id="id_concours"
                                    required
                                >

                                    <option value="">
                                        Sélectionner un concours
                                    </option>

                                </select>

                            </div>

                        </div>

                    </div>

                </div>


                <div class="modal-footer">

                    <button
                        type="button"
                        class="btn btn-secondary"
                        data-dismiss="modal">

                        Annuler

                    </button>


                    <button
                        type="submit"
                        class="btn btn-primary">

                        <i class="fa fa-save"></i>

                        Enregistrer

                    </button>

                </div>

            </form>

        </div>

    </div>

</div>

<div class="modal fade" id="modifier_examen" tabindex="-1">

    <div class="modal-dialog modal-lg">

        <div class="modal-content">

            <div class="modal-header">

                <h5 class="modal-title">
                    Modifier l'examen
                </h5>

                <button type="button"
                    class="close"
                    data-dismiss="modal">

                    <span>&times;</span>

                </button>

            </div>

            <form id="formUpdateExamen">

                <div class="modal-body">

                    <input type="hidden" id="id_examen_modif">

                    <div class="row">

                        <div class="col-md-6">

                            <div class="form-group">

                                <label>Intitulé de l'examen</label>

                                <input
                                    type="text"
                                    class="form-control"
                                    id="intitule_modif"
                                    required>

                            </div>

                        </div>

                        <div class="col-md-6">

                            <div class="form-group">

                                <label>Type d'examen</label>

                                <select
                                    class="form-control"
                                    id="type_examen_modif"
                                    required>

                                    <option value="ECRIT">Écrit</option>
                                    <option value="ORAL">Oral</option>
                                    <option value="PRATIQUE">Pratique</option>

                                </select>

                            </div>

                        </div>

                        <div class="col-md-6">

                            <div class="form-group">

                                <label>Coefficient</label>

                                <input
                                    type="number"
                                    class="form-control"
                                    id="coefficient_modif"
                                    required>

                            </div>

                        </div>

                        <div class="col-md-6">

                            <div class="form-group">

                                <label>Date de l'examen</label>

                                <input
                                    type="date"
                                    class="form-control"
                                    id="date_examen_modif"
                                    required>

                            </div>

                        </div>

                        <div class="col-md-6">

                            <div class="form-group">

                                <label>Heure</label>

                                <input
                                    type="time"
                                    class="form-control"
                                    id="heure_modif"
                                    required>

                            </div>

                        </div>

                        <div class="col-md-6">

                            <div class="form-group">

                                <label>Lieu</label>

                                <input
                                    type="text"
                                    class="form-control"
                                    id="lieu_modif"
                                    required>

                            </div>

                        </div>

                    </div>

                </div>

                <div class="modal-footer">

                    <button
                        type="button"
                        class="btn btn-secondary"
                        data-dismiss="modal">

                        Annuler

                    </button>

                    <button
                        type="submit"
                        class="btn btn-primary">

                        <i class="fa fa-save"></i>
                        Enregistrer

                    </button>

                </div>

            </form>

        </div>

    </div>

</div>

