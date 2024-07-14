// Copyright (c) 2024, Tim SiakadPlus and contributors
// For license information, please see license.txt

frappe.ui.form.on("Semester", {
    refresh(frm){
        breadcrumbs(frm, "semester", frm.doc.semester)
	},
});
