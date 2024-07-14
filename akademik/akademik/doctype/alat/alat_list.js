frappe.listview_settings['Alat'] = {
    hide_name_column: true,
    hide_name_filter: true,
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
        })
        listview.page.add_inner_button("Sinkron Alat", function() {
            frappe.call({
                method: 'akademik.akademik.doctype.data_ruang.data_ruang.sinkron_alat2',
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