sap.ui.define([
    "./BaseController",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "../model/formatter"
], function(BaseController, MessageBox, MessageToast, Fragment, JSONModel, formatter) {
    "use strict";

    return BaseController.extend("com.myorg.myapp.controller.Main", {

        formatter: formatter,

        // Funktion wird aufgerufen, wenn die Ansicht initialisiert wird
        onInit: function() {
            var oModel = new JSONModel(sap.ui.require.toUrl("model.json"));
            this._mDialogs = {}; // Map zum Halten von Dialogen
            this.getView().setModel(oModel); // Setzen des Modells für die Ansicht
            this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
            this.styleClass = this.getOwnerComponent().getContentDensityClass();
        },

        // Hilfsfunktion zum Erstellen eines neuen JSON-Eintrags basierend auf den Eingabewerten des Benutzers
        _getNewJSONEntry: function() {
            var view = this.getView();
            var artikelnummer = view.byId('inputArtikelnummer').getValue();
            var bezeichnung = view.byId('inputBezeichnung').getValue();
            var preis = view.byId('inputPreis').getValue();
            var bestand = view.byId('inputBestand').getValue();

            var Artikel = {
                Artikelnummer: artikelnummer,
                Bezeichnung: bezeichnung,
                Preis: preis,
                Bestand: bestand
            };

            // Eingabefelder leeren und Dialog schließen
            view.byId('inputArtikelnummer').setValue('');
            view.byId('inputBezeichnung').setValue('');
            view.byId('inputPreis').setValue('');
            view.byId('inputBestand').setValue('');
            this.byId("dialog").close();

            MessageToast.show("Artikel erfolgreich erstellt");
            return Artikel;
        },

        // Handler für "Bestätigen" im Dialog
        handleConfirm: function() {
            var view = this.getView();
            var artikelnummer = view.byId('inputArtikelnummer').getValue();
            var bezeichnung = view.byId('inputBezeichnung').getValue();
            var preis = view.byId('inputPreis').getValue();
            var bestand = view.byId('inputBestand').getValue();

            // Überprüfen, ob alle Felder ausgefüllt sind
            if (!artikelnummer || !bezeichnung || !preis || !bestand) {
                // Wenn nicht, wird die Warnungs-Box angezeigt und kein Artikel angelegt
                MessageBox.warning("Alle Felder müssen ausgefüllt sein.", {
                    styleClass: this.styleClass,
                    actions: [MessageBox.Action.CLOSE]
                });
                return;
            } else {
                var entry = this._getNewJSONEntry();
                // Neuen Eintrag zum Modell hinzufügen und aktualisieren
                this.getView().getModel("data").getProperty('/Artikelbestand').push(entry);
                this.getView().getModel("data").refresh(true);
                this.CreateInputWasMade = false;
            }
        },

        // Handler zum Öffnen des Dialogs über den "Erstellen"-Button
        handleCreate: function() {
            var oView = this.getView();

            if (!this.byId("dialog")) {
                Fragment.load({
                    id: oView.getId(),
                    name: "com.myorg.myapp.fragments.Create",
                    controller: this
                }).then(function(oDialog) {
                    oView.addDependent(oDialog);
                    oDialog.open();
                });
            } else {
                this.byId("dialog").open();
            }
        },

        // Handler für "Abbrechen" im Dialog
        handleCancel: function() {
            this.byId("dialog").close();
        },

        // Handler für den "Löschen"-Button
        handleDelete: function() {
            var oTable = this.byId("table");
            var aSelectedItems = oTable.getSelectedItems();
            var oModel = this.getView().getModel("data");
            var aArticles = oModel.getProperty("/Artikelbestand");
            
            // Prüfen, ob ein oder mehrere Artikel ausgewählt sind
            if (aSelectedItems.length === 0) {
                // Fehler-Box anzeigen, wenn kein Artikel ausgewählt ist
                MessageBox.error('Es muss mindestens ein Artikel ausgewählt sein.', {
                    styleClass: this.styleClass
                });
                return;
            } else {
                // Elemente entfernen, wenn mindestens ein Artikel ausgewählt ist
                aSelectedItems.forEach(function(oItem) {
                    var oContext = oItem.getBindingContext("data");
                    var iIndex = oContext.getPath().split("/").pop();
                    aArticles.splice(iIndex, 1);
                });

                oModel.setProperty("/Artikelbestand", aArticles);
                // MessageToast anzeigen, um erfolgreiche Aktion zu bestätigen
                MessageToast.show("Artikel erfolgreich gelöscht");
            }
        }
    });
});
