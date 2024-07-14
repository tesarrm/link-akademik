// Copyright (c) 2024, Tim SiakadPlus and contributors
// For license information, please see license.txt

frappe.ui.form.on("Alat", {
	refresh(frm) {
        frm.add_custom_button(__('Sinkron Alat'), function(){
            frappe.call({
                method: 'akademik.akademik.doctype.data_ruang.data_ruang.sinkron_alat2',
                callback: function(response){
                    if (response.message) {
                        console.log(response)
                    } 
                }
            })
            .then(() => {
                frappe.show_alert({ message: "Sinkronisasi berhasil!", indicator: "green" });
                listview.refresh();
            });
        });
	},
    tambah_alat(frm){
        let ruang_name = frm.doc.ruang; // Sesuaikan dengan nama field yang benar
        if (ruang_name) {
            // Melakukan redirect ke URL yang diinginkan
            window.location.href = `/app/data-ruang/${ruang_name}#alat_tab`;
        } else {
            frappe.msgprint(__('Nama ruang tidak ditemukan.'));
        }
    }
});
