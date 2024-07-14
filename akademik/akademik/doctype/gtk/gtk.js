// Copyright (c) 2024, Tim SiakadPlus and contributors
// For license information, please see license.txt

frappe.ui.form.on('GTK', {
    buat_akun: function(frm, cdt, cdn) {
        frappe.call({
            method: 'akademik.akademik.doctype.gtk.gtk.buat_akun',
            args: {
            },
            callback: function(response) {
                console.log(frm)
            }
        });
    },
	buat_akun_in_penugasan: function(frm, cdt, cdn) {
		open_generate_account_dialog(frm);
    },
	refresh: function(frm) {
        breadcrumbs(frm, frm.doc.nama)
		// // Tambahkan event handler untuk tombol "Buat Akun"
        // frm.add_custom_button(__('Buat Akun'), function() {
        //     open_generate_account_dialog(frm);
        // });

        // halo()
        // d.show();
	},
    map(frm){
        map(frm)
    }
});


// Fungsi untuk memicu pop-up buat akun
function open_generate_account_dialog(frm) {
    // Buat dialog buat akun
    let d = new frappe.ui.Dialog({
        title: __('Buat Akun'),
        fields: [
            {
                label: 'Username',
                fieldname: 'username',
                fieldtype: 'Data',
                default: frm.doc.nama,
                read_only: 1,
            },
			{
                label: 'Jenis Kelamin',
                fieldname: 'jenis_kelamin',
                fieldtype: 'Data',
                default: frm.doc.jenis_kelamin,
				hidden: 1,
            },
            {
                label: 'Email',
                fieldname: 'email',
                fieldtype: 'Data',
                default: frm.doc.email_telah_terverifikasi,
            },
			{
                label: 'Password',
                fieldname: 'password',
                fieldtype: 'Password',
                default: "sandi123",
            },
        ],
        primary_action_label: __('Buat Akun'),
        primary_action(values) {
            // Panggil metode backend untuk membuat akun
            frappe.call({
                method: 'akademik.akademik.doctype.gtk.gtk.generateAccount',
                args: {
                    selected_users: [values],
                },
                callback: function(response) {
                    if (response.message) {
						frappe.show_alert({ message: "Akun berhasil dibuat!", indicator: "green" });
                        // frappe.msgprint(__('Akun berhasil dibuat!'));
                    } else {
						frappe.show_alert({ message: "Akun gagal dibuat!", indicator: "red" });
                        // frappe.msgprint(__('Akun gagal dibuat!'));
                    }
                }
            });
            d.hide();
        }
    });

    // Tampilkan dialog
    d.show();
}








// default dari tesar
let d = new frappe.ui.Dialog({
    title: 'Penugasan',
    fields: [
        {
            fieldtype: 'Section Break',
            label: 'Penugasan'
        },
        {
            fieldtype: 'Column Break'
        },
        {
            label: 'Jenis PTK',
            fieldname: 'jenis_ptk',
            fieldtype: 'Data',
            reqd: 1
        },
        {
            label: 'Nomor Surat Tugas',
            fieldname: 'nomor_surat_tugas',
            fieldtype: 'Data',
            reqd: 1
        },
        {
            label: 'Tgl Surat Tugas',
            fieldname: 'tgl_surat_tugas',
            fieldtype: 'Date'
        },
        {
            fieldtype: 'Column Break'
        },
        {
            label: 'TMT Tugas',
            fieldname: 'tmt_tugas',
            fieldtype: 'Date'
        },
        {
            label: 'Sekolah Induk',
            fieldname: 'sekolah_induk',
            fieldtype: 'Data'
        },
        {
            label: 'Keaktifan PTK',
            fieldname: 'keaktifan_ptk',
            fieldtype: 'Table MultiSelect',
            options: 'ctBulan'
        },
        {
            fieldtype: 'Section Break',
            label: 'Diisi saat Sudah Keluar'
        },
        {
            fieldtype: 'Column Break'
        },
        {
            label: 'Keluar karena',
            fieldname: 'keluar_karena',
            fieldtype: 'Select',
            options: [
                "",
                "Mutasi",
                "Dikeluarkan",
                "Mengundurkan diri",
                "Wafat",
                "Hilang",
                "Alih fungsi",
                "Pensiun",
            ]
        },
        {
            fieldtype: 'Column Break'
        },
        {
            label: 'Tgl Keluar',
            fieldname: 'tgl_keluar',
            fieldtype: 'Date'
        },
    ],
    size: 'large',
    primary_action_label: 'Submit',
    primary_action(values) {
        console.log(values);
        d.hide();
    }
});

