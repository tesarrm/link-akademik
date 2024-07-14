// Copyright (c) 2024, Tim SiakadPlus and contributors
// For license information, please see license.txt

frappe.ui.form.on("Rombel", {
    tambah_anggota(frm){
        frappe.set_route('List', 'Peserta Didik');
    },
	refresh(frm) {
        frappe.call({
            method: 'frappe.client.get_doc',
            args: {
                doctype: "Pengaturan Akademik"
            },
            callback(r){
                console.log(r)
            }

        })
        breadcrumbs(frm, "rombel", frm.doc.nama_rombel)
        frappe.call({
            method: 'akademik.akademik.doctype.rombel.rombel.get_rombel',
            callback: function(r) {
                console.log(r)
            }

        })
        frappe.call({
            method: 'frappe.client.get_list',
            args: {
                doctype: "Peserta Didik",
                filters: {
                    rombel: frm.doc.name,
                },
                fields: ["*"] 
            },
            callback: function(r) {
                if (r.message) {

                    frm.clear_table("anggota");

                    r.message.forEach(function(item) {
                        var child_table = "anggota";

                        var child = frm.add_child(child_table);
                        [
                            "link", "foto_profil", "nama", "jenis_kelamin", "nis", "kwarganegaraan", "nik", "no_kk",
                            "tempat_lahir", "tanggal_lahir", "no_akta", "berkebutuhan_khusus", "agama", "anak_ke",
                            "penerima_kpspkh", "apakah_punya_kip", "apakah_peserta_didik_tersebut_layak_mendapatkan_kip",
                            "alasan_layak_kip", "alamat_jalan", "rt", "rw", "nama_dusun", "desakelurahan", "kode_pos",
                            "tempat_tinggal", "transportasi", "lintang", "bujur", "map", "nama_bank", "no_rekening",
                            "kantor_cabang_pemilu_kcp", "rekening_atas_nama", "nama_ayah", "nik_ayah", "tahun_lahir_ayah",
                            "pendidikan_ayah", "pekerjaan_ayah", "penghasilan_ayah", "kebutuhan_khusus_ayah", "nama_ibu",
                            "nik_ibu", "tahun_lahir_ibu", "pendidikan_ibu", "pekerjaan_ibu", "penghasilan_ibu",
                            "kebutuhan_khusus_ibu", "nama_wali", "nik_wali", "tahun_lahir_wali", "pendidikan_wali",
                            "pekerjaan_wali", "penghasilan_wali", "kebutuhan_khusus_wali", "nomor_telepon_rumah",
                            "nomor_hp", "email"
                        ]
                        .forEach(function(field) {
                            if(field == "link"){
                                child[field] = item["name"];
                            }else{
                                child[field] = item[field];
                            }
                        });
                    });

                    frm.refresh_field("anggota");
                }
            }
        });
        // frappe.call({
        //     method: 'frappe.client.get_list',
        //     args: {
        //         doctype: "Pembelajaran",
        //         fields: ["*"] 
        //     },
        //     callback: function(r) {
        //         if (r.message) {

        //             frm.clear_table("matpel_bidang_studi_wajib_tambahan_max_2jam");
        //             frm.clear_table("matpel_muatan_nasional");
        //             frm.clear_table("matpel_muatan_kewilayahan");
        //             frm.clear_table("kompetensi_keahlian_c3");
        //             frm.clear_table("matpel_lainnya");

        //             r.message.forEach(function(item) {
        //                 var t = item.type_bidang_studi
        //                 var child_table;
                
        //                 if(frm.doc.tipe == "Praktik"){
        //                     if(item.tipe == "Praktik") {
        //                         if (t === "Matpel Bidang Studi Wajib (tambahan max 2jam)") {
        //                             child_table = "matpel_bidang_studi_wajib_tambahan_max_2jam";
        //                         } else if (t === "Matpel Muatan Nasional") {
        //                             child_table = "matpel_muatan_nasional";
        //                         } else if (t === "Matpel Muatan Kewilayahan") {
        //                             child_table = "matpel_muatan_kewilayahan";
        //                         } else if (t === "Kompetensi Keahlian (C3)") {
        //                             child_table = "kompetensi_keahlian_c3";
        //                         } else if (t === "Matpel Lainnya") {
        //                             child_table = "matpel_lainnya";
        //                         }
        //                     }
        //                 } else if(frm.doc.tipe == "Mat Pilihan") {
        //                     if(item.tipe == "Pilihan") {
        //                         if (t === "Matpel Bidang Studi Wajib (tambahan max 2jam)") {
        //                             child_table = "matpel_bidang_studi_wajib_tambahan_max_2jam";
        //                         } else if (t === "Matpel Muatan Nasional") {
        //                             child_table = "matpel_muatan_nasional";
        //                         } else if (t === "Matpel Muatan Kewilayahan") {
        //                             child_table = "matpel_muatan_kewilayahan";
        //                         } else if (t === "Kompetensi Keahlian (C3)") {
        //                             child_table = "kompetensi_keahlian_c3";
        //                         } else if (t === "Matpel Lainnya") {
        //                             child_table = "matpel_lainnya";
        //                         }
        //                     }
        //                 } else {
        //                     if (t === "Matpel Bidang Studi Wajib (tambahan max 2jam)") {
        //                         child_table = "matpel_bidang_studi_wajib_tambahan_max_2jam";
        //                     } else if (t === "Matpel Muatan Nasional") {
        //                         child_table = "matpel_muatan_nasional";
        //                     } else if (t === "Matpel Muatan Kewilayahan") {
        //                         child_table = "matpel_muatan_kewilayahan";
        //                     } else if (t === "Kompetensi Keahlian (C3)") {
        //                         child_table = "kompetensi_keahlian_c3";
        //                     } else if (t === "Matpel Lainnya") {
        //                         child_table = "matpel_lainnya";
        //                     }
        //                 }

        //                 if(child_table) {
        //                     var child = frm.add_child(child_table);
        //                     ['tipe', 'type_bidang_studi', 'bidang_studi', 'nama_bidang_studi', 'kode_matpel', 'ptk',
        //                     'sk_mengajar', 'tgl_sk', 'jam', 'max']
        //                     .forEach(function(field) {
        //                         child[field] = item[field];
        //                     });
        //                 }
        //             });

        //             frm.refresh_field("matpel_bidang_studi_wajib_tambahan_max_2jam");
        //             frm.refresh_field("matpel_muatan_nasional");
        //             frm.refresh_field("matpel_muatan_kewilayahan");
        //             frm.refresh_field("kompetensi_keahlian_c3");
        //             frm.refresh_field("matpel_lainnya");
        //         }
        //     }
        // });

        frappe.call({
            method: 'frappe.client.get_list',
            args: {
                doctype: "Pembelajaran",
                fields: ["*"] 
            },
            callback: function(r) {
                if (r.message) {
                    r.message.forEach(function(item) {
                        var t = item.type_bidang_studi;
                        var child_table = null;
                        
                        if(frm.doc.tipe == "Praktik" && item.tipe == "Praktik") {
                            if (t === "Matpel Bidang Studi Wajib (tambahan max 2jam)") {
                                child_table = "matpel_bidang_studi_wajib_tambahan_max_2jam";
                            } else if (t === "Matpel Muatan Nasional") {
                                child_table = "matpel_muatan_nasional";
                            } else if (t === "Matpel Muatan Kewilayahan") {
                                child_table = "matpel_muatan_kewilayahan";
                            } else if (t === "Kompetensi Keahlian (C3)") {
                                child_table = "kompetensi_keahlian_c3";
                            } else if (t === "Matpel Lainnya") {
                                child_table = "matpel_lainnya";
                            }
                        } else if(frm.doc.tipe == "Mat Pilihan" && item.tipe == "Pilihan") {
                            if (t === "Matpel Bidang Studi Wajib (tambahan max 2jam)") {
                                child_table = "matpel_bidang_studi_wajib_tambahan_max_2jam";
                            } else if (t === "Matpel Muatan Nasional") {
                                child_table = "matpel_muatan_nasional";
                            } else if (t === "Matpel Muatan Kewilayahan") {
                                child_table = "matpel_muatan_kewilayahan";
                            } else if (t === "Kompetensi Keahlian (C3)") {
                                child_table = "kompetensi_keahlian_c3";
                            } else if (t === "Matpel Lainnya") {
                                child_table = "matpel_lainnya";
                            }
                        } else {
                            if (t === "Matpel Bidang Studi Wajib (tambahan max 2jam)") {
                                child_table = "matpel_bidang_studi_wajib_tambahan_max_2jam";
                            } else if (t === "Matpel Muatan Nasional") {
                                child_table = "matpel_muatan_nasional";
                            } else if (t === "Matpel Muatan Kewilayahan") {
                                child_table = "matpel_muatan_kewilayahan";
                            } else if (t === "Kompetensi Keahlian (C3)") {
                                child_table = "kompetensi_keahlian_c3";
                            } else if (t === "Matpel Lainnya") {
                                child_table = "matpel_lainnya";
                            }
                        }

                        if (child_table) {
                            // Check if item already exists in child table
                            var existing_child = frm.doc[child_table].find(function(child) {
                                return child.kode_matpel === item.kode_matpel; // Adjust the condition based on your unique identifier
                            });

                            if (!existing_child) {
                                var child = frm.add_child(child_table);
                                ['tipe', 'type_bidang_studi', 'bidang_studi', 'nama_bidang_studi', 'kode_matpel', 'ptk',
                                'sk_mengajar', 'tgl_sk', 'jam', 'max']
                                .forEach(function(field) {
                                    child[field] = item[field];
                                });

                                frm.refresh_field(child_table);
                            }
                        }
                    });
                }
            }
        });
	},
});
