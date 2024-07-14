frappe.listview_settings['Hari Libur'] = {
    hide_name_column: true,
    hide_name_filter: true,
    refresh: function(listview) {
        listview.page.add_inner_button("Sinkron Hari Libur Nasional", function() {
            frappe.call({
                method: 'akademik.akademik.doctype.hari_libur.hari_libur.sinkron_hariliburnasional',
                callback: function(response) {
                    if (response.message) {
                        console.log(response);
                    }
                }
            })
            .then(() => {
                frappe.show_alert({ message: "Sinkronisasi berhasil!", indicator: "green" });
                listview.refresh();
            })
            .catch((error) => {
                frappe.show_alert({ message: `Sinkronisasi gagal!`, indicator: "red" });
            });
        });
    },
};
