frappe.listview_settings['Angkutan Buku'] = {
    refresh: function(listview) {
        console.log("halo")
        listview.page.add_inner_button("Pusat Perbukuan", function() {
            frappe.call({
                method: 'akademik.akademik.doctype.buku.buku.sinkron_buku',
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