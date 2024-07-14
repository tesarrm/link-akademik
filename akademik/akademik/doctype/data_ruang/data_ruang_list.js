frappe.listview_settings["Data Ruang"] = {
    hide_name_column: true,
    hide_name_filter: true,
    refresh: function(listview) {
        listview.page.add_inner_button("Sinkron Alat", function() {
            frappe.call({
                method: 'akademik.akademik.doctype.data_ruang.data_ruang.sinkron_alat',
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
}
