// Copyright (c) 2024, Tim SiakadPlus and contributors
// For license information, please see license.txt

frappe.ui.form.on('GTK', {
    buat_akun: function(frm, cdt, cdn) {
        frappe.call({
            method: 'akademik.akademik.doctype.gtk.gtk.buat_akun',
            args: {
            },
            callback: function(response) {
                console.log(frm)
            }
        });
    }
});
