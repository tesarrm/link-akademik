// Copyright (c) 2024, Tim SiakadPlus and contributors
// For license information, please see license.txt

frappe.ui.form.on("Tahun Ajaran", {
    refresh(frm){
        breadcrumbs(frm, "tahun-ajaran", frm.doc.tahun_ajaran)
	},
});
