// Copyright (c) 2024, Tim SiakadPlus and contributors
// For license information, please see license.txt

frappe.ui.form.on("Data Buku", {
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
        label: "Data Buku",
        route: '/app/data-buku/view/list',
    });               
    if(frm.doc.judul){
        frappe.breadcrumbs.set_custom_breadcrumbs({
            label: frm.doc.judul,
        });               
    } else {
        frappe.breadcrumbs.set_custom_breadcrumbs({
            label: "Buat Buku",
        });               
    }
}
