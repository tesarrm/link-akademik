// Copyright (c) 2024, Tim SiakadPlus and contributors
// For license information, please see license.txt

frappe.ui.form.on("Kehadiran", {
    refresh: function (frm) {
        frappe.call({
            method: 'akademik.akademik.doctype.kehadiran.kehadiran.sinkron_data_kehadiran',
            callback: function(r) {
                console.log(r)
            }
        })
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
        frm.trigger("update_peserta_didik");
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
        frm.set_value('pembelajaran', null);
        frm.set_value('tanggal', null);
        frm.set_value('kehadiran', null);
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

                    frappe.call({
                        method: "frappe.client.get_list",
                        args: {
                            doctype: "Data Kehadiran 2",
                            filters: {
                                "rombel": frm.doc.rombel,
                                "pembelajaran": frm.doc.pembelajaran,
                                "tanggal": frm.doc.tanggal,
                                "peserta_didik": frm.doc.peserta_didik,
                            },
                            fields: ["*"]
                        },
                        callback: function(n) {

                            if(n.message.length != 0){
                                console.log("halo dari n")
                                var child_table = "kehadiran";
                                frm.clear_table(child_table);

                                n.message.forEach(function(i) {

                                    var child = frm.add_child(child_table);
                                    child["rombel"] = frm.doc.rombel;
                                    child["pembelajaran"] = frm.doc.pembelajaran;
                                    child["tanggal"] = frm.doc.tanggal;
                                    child["peserta_didik_id"] = i["peserta_didik_id"]
                                    child["peserta_didik"] = i["peserta_didik"]
                                    child["kehadiran"] = i["kehadiran"]

                                    frm.refresh_field(child_table);
                                });
                            } else {
                                console.log("halo dari r")
                                var child_table = "kehadiran";
                                frm.clear_table(child_table);

                                r.message.forEach(function(item) {
                                    console.log("halo")
                                    var child = frm.add_child(child_table);
                                    child["rombel"] = frm.doc.rombel;
                                    child["pembelajaran"] = frm.doc.pembelajaran;
                                    child["tanggal"] = frm.doc.tanggal;
                                    child["peserta_didik_id"] = item["name"]
                                    child["peserta_didik"] = item["nama"]

                                    frm.refresh_field(child_table);
                                });
                            }
                        }
                    })

                }
            })
        }
    }
});