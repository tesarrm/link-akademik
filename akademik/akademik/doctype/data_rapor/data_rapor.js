// Copyright (c) 2024, Tim SiakadPlus and contributors
// For license information, please see license.txt

frappe.ui.form.on("Data Rapor", {
	refresh(frm) {
        if(frm.doc.rombel) {
            frappe.call({
                method: 'frappe.client.get_list',
                args: {
                    doctype: "Peserta Didik",
                    filters: {
                        rombel: frm.doc.rombel,
                    },
                    fields: ["*"] 
                },
                callback: function(r) {
                    if (r.message) {

                        var child_table = "nilai_rapor";

                        if (frm.doc[child_table] && frm.doc[child_table].length > 0) {
                            return; 
                        }

                        frm.clear_table("nilai_rapor");

                        r.message.forEach(function(item) {

                            var child = frm.add_child(child_table);
                            child['nama_peserta_didik'] = item['nama'];
                            child['nis'] = item['nis'];
                        });

                        frm.refresh_field("nilai_rapor");
                    }
                }
            });
        }

	},
    rombel(frm) {
        if(frm.doc.rombel) {
            frappe.call({
                method: 'frappe.client.get_list',
                args: {
                    doctype: "Peserta Didik",
                    filters: {
                        rombel: frm.doc.rombel,
                    },
                    fields: ["*"] 
                },
                callback: function(r) {
                    if (r.message) {

                        frm.clear_table("nilai_rapor");

                        r.message.forEach(function(item) {
                            var child_table = "nilai_rapor";

                            var child = frm.add_child(child_table);
                            child['nama_peserta_didik'] = item['nama'];
                            child['nis'] = item['nis'];
                        });

                        frm.refresh_field("nilai_rapor");
                    }
                }
            });
        }
    }
});
