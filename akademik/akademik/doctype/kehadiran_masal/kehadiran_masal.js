// Copyright (c) 2024, Tim SiakadPlus and contributors
// For license information, please see license.txt

frappe.ui.form.on("Kehadiran Masal", {
    refresh: function (frm) {
        frm.set_query("pembelajaran", (doc) => {
            if (doc.rombel){
                return {
                    filters: {
                        "rombel": doc.rombel
                    }
                }
            } else {
                return {
                    filters: {
                        "rombel": "==tidak ada=="
                    }
                }
            }
        });
        frappe.call({
            method: 'akademik.akademik.doctype.kehadiran.kehadiran.sinkron_data_kehadiran',
            callback: function(r) {
                console.log(r)
            }
        })
    },
    rombel(frm) {
        frm.trigger("update_peserta_didik");
        frm.set_query("pembelajaran", (doc) => {
            if (doc.rombel){
                return {
                    filters: {
                        "rombel": doc.rombel
                    }
                }
            } else {
                return {
                    filters: {
                        "rombel": "==tidak ada=="
                    }
                }
            }
        });
    },
    pembelajaran(frm) {
        frm.trigger("update_peserta_didik");
    },
    tanggal(frm) {
        frm.trigger("update_peserta_didik");
    },
    update_peserta_didik: function(frm) {
        if(frm.doc.rombel && frm.doc.pembelajaran && frm.doc.tanggal){
            frappe.call({
                method: "frappe.client.get_list",
                args: {
                    doctype: "Peserta Didik",
                    filters: {
                    "rombel": frm.doc.rombel 
                    },
                    fields: ["*"]
                },
                callback: function(r) {
                    if (r.message) {
                        var child_table = "kehadiran";
                        frm.clear_table(child_table);

                        r.message.forEach(function(item) {

                            var existing_child = frm.doc[child_table].find(function(child) {
                                return child.pembelajaran === frm.doc.pembelajaran &&
                                    child.rombel === frm.doc.rombel && 
                                    child.tanggal === frm.doc.tanggal &&
                                    child.peserta_didik === frm.doc.peserta_didik 
                            })
                            if (!existing_child) {
                                console.log("halo")
                                var child = frm.add_child(child_table);
                                child["rombel"] = frm.doc.rombel;
                                child["pembelajaran"] = frm.doc.pembelajaran;
                                child["tanggal"] = frm.doc.tanggal;
                                child["peserta_didik_id"] = item["name"]
                                child["peserta_didik"] = item["nama"]

                                frm.refresh_field(child_table);
                            }
                        });
                    }
                }
            })
        }
    }
});