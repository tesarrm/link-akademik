// Copyright (c) 2024, Tim SiakadPlus and contributors
// For license information, please see license.txt

frappe.ui.form.on("Data Tanah", {
	refresh(frm) {
        breadcrumbs(frm, frm.doc.nama)
	},
    map(frm){
        map(frm)
    },
});

