// Copyright (c) 2024, Tim SiakadPlus and contributors
// For license information, please see license.txt

frappe.ui.form.on("Data Alat", {
	refresh(frm) {
        breadcrumbs(frm);
        frm.add_custom_button(__('Bantuan'), function(){
            frappe.set_route('List', 'Data Bantuan');
        });
	},
});


function breadcrumbs(frm){
    frappe.breadcrumbs.clear();
    
    frappe.breadcrumbs.set_custom_breadcrumbs({
        label: "Akademik", 
        route: '/app/akademik',
    });
    frappe.breadcrumbs.set_custom_breadcrumbs({
        label: "Data Alat",
        route: '/app/data-alat/view/list',
    });               
    if(frm.doc.nama){
        frappe.breadcrumbs.set_custom_breadcrumbs({
            label: frm.doc.nama,
        });               
    } else {
        frappe.breadcrumbs.set_custom_breadcrumbs({
            label: "Buat Alat",
        });               
    }
}
