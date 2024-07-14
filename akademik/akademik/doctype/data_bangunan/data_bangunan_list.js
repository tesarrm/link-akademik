frappe.listview_settings["Data Bangunan"] = {
    hide_name_column: true,
    hide_name_filter: true,
    refresh: function(listview) {
        listview.page.add_inner_button("Sinkron Ruang", function() {
            frappe.call({
                method: 'akademik.akademik.doctype.data_bangunan.data_bangunan.sinkron_ruang',
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
        });;
    },
};
