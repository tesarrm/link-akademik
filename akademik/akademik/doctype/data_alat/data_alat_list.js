function get_checked_items(listview) {
    return listview.get_checked_items();
}

function open_dialog(listview, data) {
    let d = new frappe.ui.Dialog({
        title: 'Hapus Pembukuan Alat',
        fields: [
            {
                label: 'Ruang',
                fieldname: 'ruang',
                fieldtype: 'Link',
                options: 'Data Ruang',
                default: data.ruang
            },
            {
                label: 'Jenis Sarana',
                fieldname: 'jenis_sarana',
                fieldtype: 'Data',
                default: data.jenis_sarana
            },
            {
                label: 'Nama',
                fieldname: 'nama',
                fieldtype: 'Data',
                default: data.nama
            },
            {
                label: 'Spesifikasi',
                fieldname: 'spesifikasi',
                fieldtype: 'Data',
                default: data.spek
            },
            {
                label: 'Kepimilikan',
                fieldname: 'kepimilikan',
                fieldtype: 'Select',
                options: 'Milik\nTidak Milik',
                default: data.kepemilikan
            },
            {
                fieldname: 'section_break1',
                fieldtype: 'Section Break'
            },
            {
                label: 'Hapus Buku',
                fieldname: 'hapus_buku',
                fieldtype: 'Select',
                options: 'Bencana\nDibongkar\nDipindah Tangankan\nDisita\nKoreksi Data'
            },
            {
                label: 'Tanggal Hapus Buku',
                fieldname: 'tgl_hapus_buku',
                fieldtype: 'Date',
            },
        ],
        primary_action_label: 'Submit',
        primary_action(values) {
            d.hide();
            frappe.call({
                method: 'frappe.client.delete',
                args: {
                    doctype: 'Data Alat',
                    name: data.name
                },
                callback: function(response) {
                    if (!response.exc) {
                        frappe.msgprint(__('Alat berhasil dihapus.'));
                        listview.refresh();
                    } else {
                        frappe.msgprint(__('An error occurred while deleting the item.'));
                    }
                }
            });
        }
    });
    d.show();
}

frappe.listview_settings['Data Alat'] = {
    hide_name_column: true,
    hide_name_filter: true,

    onload: function (listview) {
        listview.page.add_inner_button(__("Hapus Pembukuan Alat"), function () {
            var items = get_checked_items(listview);
            if (items.length === 0) {
                frappe.msgprint(__('Pilih salah satu data.'));
            } else if (items.length > 1) {
                frappe.msgprint(__('Silakan pilih satu item saja.'));
            } else {
                var item_data = items[0];
                var data = {
                    name: item_data.name,
                    ruang: item_data.ruang,
                    jenis_sarana: item_data.jenis_sarana,
                    nama: item_data.nama,
                    spek: item_data.spek,
                    kepemilikan: item_data.kepemilikan,
                };
                open_dialog(listview, data);
            }
        });
    }
};
