frappe.listview_settings['Data Buku'] = {
    hide_name_column: true,
    hide_name_filter: true,
    refresh: function(listview) {
        listview.page.add_inner_button("Sinkron Pusat Perbukuan", function() {
            frappe.call({
                method: 'akademik.akademik.doctype.pusat_buku.pusat_buku.sinkron_buku',
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