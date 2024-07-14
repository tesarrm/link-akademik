// Copyright (c) 2024, Tim SiakadPlus and contributors
// For license information, please see license.txt

frappe.ui.form.on("Data Angkutan", {
	refresh(frm) {
        breadcrumbs(frm)
	},
});

function breadcrumbs(frm){
    frappe.breadcrumbs.clear();
    
    frappe.breadcrumbs.set_custom_breadcrumbs({
        label: "Akademik", 
        route: '/app/akademik',
    });
    frappe.breadcrumbs.set_custom_breadcrumbs({
        label: "Data Ruang",
        route: '/app/data-angkutan/view/list',
    });               
    if(frm.doc.nama){
        frappe.breadcrumbs.set_custom_breadcrumbs({
            label: frm.doc.nama,
        });               
    } else {
        frappe.breadcrumbs.set_custom_breadcrumbs({
            label: "Buat Angkutan",
        });               
    }
}