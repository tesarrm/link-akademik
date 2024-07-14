// Copyright (c) 2024, Tim SiakadPlus and contributors
// For license information, please see license.txt

frappe.ui.form.on("Rombel 2", {
	refresh(frm) {
        frappe.call({
            method: 'frappe.client.get',
            args: {
                doctype: "Pengaturan Akademik"
            },
            callback(r){
                frm.set_value("kurikulum", r.message.kurikulum)
            }
        })
	},
});
