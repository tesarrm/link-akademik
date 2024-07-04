// Copyright (c) 2024, Tim SiakadPlus and contributors
// For license information, please see license.txt

frappe.ui.form.on("Angkutan Buku", {
	refresh(frm) {
        frm.add_custom_button(__('Sinkron Angkutan'), function(){
            frappe.call({
                method: 'akademik.akademik.doctype.angkutan_buku.angkutan_buku.sinkron_angkutan',
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
        frm.add_custom_button(__("Pusat Perbukuan"), function() {     
            frappe.set_route('List', 'Pusat Buku');
        });;
	},
});
