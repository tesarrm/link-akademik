// Copyright (c) 2024, Tim SiakadPlus and contributors
// For license information, please see license.txt

frappe.ui.form.on("Peserta Didik", {
	refresh: function(frm) {
		// Menambahkan breadcrumbs
		breadcrumbs(frm);

		// Menambahkan tombol custom pada form view
		if (!frm.is_new()) {
			frm.add_custom_button(__('Buat Akun'), function() {
				// Action ketika tombol diklik
				createUserAccount(frm);
			});
		}
	},
	// target button buat_akun di peserta didik
	buat_akun: function(frm, cdt, cdn) {
		open_generate_account_dialog(frm);
    },
	validate: function(frm) {
        let phone_field = frm.doc.nomor_hp;

		let indonesia_phone_regex = /^62/;


        if (phone_field && !indonesia_phone_regex.test(phone_field)) {
            frappe.msgprint(__('Nomor telepon harus berupa nomor telepon Indonesia yang valid.'));
            frappe.validated = false;
        }
    }
});

// pop up modal create account
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
                default: frm.doc.email,
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
                method: 'akademik.akademik.doctype.peserta_didik.peserta_didik.generateAccount',
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


function breadcrumbs(frm) {
	frappe.breadcrumbs.clear();

	frappe.breadcrumbs.set_custom_breadcrumbs({
		label: "Akademik",
		route: '/app/akademik',
	});
	frappe.breadcrumbs.set_custom_breadcrumbs({
		label: "Peserta Didik",
		route: '/app/peserta-didik/view/list',
	});
	if (frm.doc.nama) {
		frappe.breadcrumbs.set_custom_breadcrumbs({
			label: frm.doc.nama,
		});
	} else {
		frappe.breadcrumbs.set_custom_breadcrumbs({
			label: "Buat Peserta Didik",
		});
	}
}


function createUserAccount(frm) {
	// Ambil data dari form "Peserta Didik"
	var data = {
		first_name: frm.doc.nama,
		email: frm.doc.email,
		gender: frm.doc.jenis_kelamin,
	};

	// Kirim data untuk insert ke doctype "User"
	frappe.call({
		method: 'akademik.akademik.doctype.peserta_didik.peserta_didik.insertUserFromPesertaDidik',
		args: {
			data: data
		},
		callback: function(response) {
			if (response.message && response.message.status === "success") {
				frappe.msgprint("User account created successfully!");
			} else {
				frappe.msgprint("Failed to create user account.");
			}
		}
	});
}
