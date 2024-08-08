sap.ui.define(['sap/ui/core/format/NumberFormat'], function (NumberFormat) {
    "use strict";


	// Formatter um Bestand farblich zu markieren
	var Formatter = {
			
		formatStock :  function (Bestand) {

			if (Bestand > 49) {
				return "Success" // Grün wenn größer 49
			} else if (Bestand < 10) {
				return "Error"; // Rot wenn kleiner 10
			} else {
				return "Warning"; // Alles Andere Orange
			}
		}
	}

	return Formatter;
})
