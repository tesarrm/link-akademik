frappe.listview_settings['Alat'] = {
    refresh: function(listview) {
        listview.page.add_inner_button("Sinkron Data Ruang", function() {
            frappe.call({
                method: 'akademik.akademik.doctype.alat.alat.sinkron_ruang',
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