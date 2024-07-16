frappe.ui.form.on("Pembayaran", {
    refresh: function(frm) {
        frm.add_custom_button(__('Select All Rombel'), function() {
            frappe.call({
                method: "akademik.akademik.doctype.pembayaran.pembayaran.get_all_rombels",
                callback: function(r) {
                    if (r.message) {
                        let all_rombels = r.message.map(function(rombel) {
                            return { "rombel": rombel.nama_rombel };
                        });
                        frm.set_value('rombel', all_rombels);
                    }
                },
                error: function(error) {
                    console.error("Error fetching rombels: ", error);
                    frappe.msgprint(__('Failed to fetch Rombels. Please check the server logs for more details.'));
                }
            });
        });

        // frm.fields_dict['rombel'].grid.wrapper.on('change', function() {
        //     const selected_rombels = frm.doc.rombel.map(row => row.rombel);
        //     if (selected_rombels.length > 0) {
        //         frappe.call({
        //             method: "akademik.akademik.doctype.pembayaran.pembayaran.get_peserta_didik_by_rombel",
        //             args: {
        //                 rombel: selected_rombels
        //             },
        //             callback: function(r) {
        //                 if (r.message) {
        //                     frm.clear_table('table_dgpx');
        //                     r.message.forEach(function(peserta) {
        //                         let new_row = frm.add_child('table_dgpx');
        //                         new_row.nama = peserta.nama;
        //                         new_row.nis = peserta.nis;
        //                         // set other fields accordingly
        //                     });
        //                     frm.refresh_field('table_dgpx');
        //                 }
        //             },
        //             error: function(error) {
        //                 console.error("Error fetching peserta didik: ", error);
        //                 frappe.msgprint(__('Failed to fetch Peserta Didik. Please check the server logs for more details.'));
        //             }
        //         });
        //     }
        // });
    }
});
