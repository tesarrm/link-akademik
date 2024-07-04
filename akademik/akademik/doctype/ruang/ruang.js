// Copyright (c) 2024, Tim SiakadPlus and contributors
// For license information, please see license.txt

frappe.ui.form.on("Ruang", {
	refresh(frm) {
        frm.add_custom_button(__('Sinkron Ruang'), function(){
            frappe.call({
                method: 'akademik.akademik.doctype.ruang.ruang.sinkron_ruang',
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
});
