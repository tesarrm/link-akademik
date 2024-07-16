frappe.listview_settings["GTK"] = {
	hide_name_column: true,
	hide_name_filter: true,

	// custom
	onload: function (listview) {
		listview.settings.formatters = {
			email: function (value, doc) {
				return `
                    <div class="list-row-col ellipsis hidden-xs ">
                        <span class="ellipsis" title="Email: ${value}">
                            <a class="filterable ellipsis" href="mailto:${value}">
                                ${value}
                            </a>
                        </span>
                    </div>
                `;
			},
			nomor_hp: function (value, doc) {
				return `
                    <div class="list-row-col ellipsis hidden-xs ">
                        <span class="ellipsis" title="Nomor HP: ${value}">
                            <a class="filterable ellipsis" href="https://wa.me/${value}">
                                ${value}
                            </a>
                        </span>
                    </div>
                `;
			},
		};
		//ini punya tesar

        // custom button for generate account in gtk
		listview.page.add_inner_button("Generate Account", function () {
            const selected_items = listview.get_checked_items();

            if (selected_items.length === 0) {
                frappe.msgprint(__('Pilih setidaknya satu pengguna untuk membuat akun.'));
                return;
            }

            // melakukan get data untuk mendapatkan data yang diselect secara lengkap
            frappe.call({
                method: 'akademik.akademik.doctype.gtk.gtk.getGTK',
                callback: function(response) {
                    if (response.message) {
                        let gtk_data = response.message;
                        let selected_users = [];

                        selected_items.forEach(function(selected) {
                            let user_data = gtk_data.find(item => item.name === selected.name);

                            if (user_data) {
                                let email = user_data.email_telah_terverifikasi;
                                let nomor_hp = user_data.nomor_hp;

                                if (selected.nama && email && selected.jenis_kelamin) {
                                    selected_users.push({
                                        username: selected.nama,
                                        email: email,
                                        jenis_kelamin: selected.jenis_kelamin,
                                        nomor_hp: nomor_hp,
                                        alamat: selected.alamat_jalan
                                    });
                                } else {
                                    frappe.msgprint(
                                        __("Email tidak boleh  kosong untuk pengguna: {0}", [selected.nama])
                                    );
                                    console.error('Data item tidak lengkap:', selected);
                                }
                            }
                        });

                        console.log(selected_users);

                        frappe.call({
                            method: "akademik.akademik.doctype.gtk.gtk.generateAccount",
                            args: {
                                selected_users: selected_users,
                            },
                            callback: function (response) {
                                if (response.status == "success") {
                                    console.log(response);
                                    frappe.show_alert({ message: "Akun berhasil dibuat!", indicator: "green" });
                                }else {
                                    frappe.show_alert({ message: "Akun gagal dibuat!", indicator: "red" });
                                }
                            },
                        })
                    }
                }
            });
        });
	},

	add_fields: ["Penugasan"],

	button: {
		show: function (doc) {
			return '<i class="fa fa-edit"></i>';
		},
		get_label: function () {
			return __('<i class="fa fa-edit"></i>', null, "Access");
		},
		get_description: function (doc) {
			return __("Penugasan" + doc.nama);
		},
		action: function (doc) {
			console.log(doc.name);
			frappe.db.get_doc("GTK", doc.name).then((r) => {
				let d = new frappe.ui.Dialog({
					title: `Penugasan ${doc.nama}`,
					fields: [
						{
							fieldtype: "Section Break",
							label: "Penugasan",
						},
						{
							fieldtype: "Column Break",
						},
						{
							label: "Jenis PTK",
							fieldname: "jenis_ptk",
							fieldtype: "Data",
							reqd: 1,
						},
						{
							label: "Nomor Surat Tugas",
							fieldname: "nomor_surat_tugas",
							fieldtype: "Data",
							reqd: 1,
						},
						{
							label: "Tgl Surat Tugas",
							fieldname: "tanggal_surat_tugas",
							fieldtype: "Date",
						},
						{
							fieldtype: "Column Break",
						},
						{
							label: "TMT Tugas",
							fieldname: "tmt_tugas",
							fieldtype: "Data",
						},
						{
							label: "Sekolah Induk",
							fieldname: "sekolah_induk",
							fieldtype: "Data",
						},
						{
							label: "Keaktifan PTK",
							fieldname: "keaktifan",
							fieldtype: "Table MultiSelect",
							options: "ctBulan",
						},
						{
							fieldtype: "Section Break",
							label: "Diisi saat Sudah Keluar",
						},
						{
							fieldtype: "Column Break",
						},
						{
							label: "Keluar karena",
							fieldname: "keluar_karena",
							fieldtype: "Select",
							options: [
								"",
								"Mutasi",
								"Dikeluarkan",
								"Mengundurkan diri",
								"Wafat",
								"Hilang",
								"Alih fungsi",
								"Pensiun",
							],
						},
						{
							fieldtype: "Column Break",
						},
						{
							label: "Tgl Keluar",
							fieldname: "tgl_keluar",
							fieldtype: "Date",
						},
					],
					size: "large",
					primary_action_label: "Submit",
					primary_action(values) {
						frappe.call({
							method: "frappe.client.set_value",
							args: {
								doctype: "GTK",
								name: doc.name,
								fieldname: {
									jenis_ptk: values.jenis_ptk,
									nomor_surat_tugas: values.nomor_surat_tugas,
									tanggal_surat_tugas: values.tanggal_surat_tugas,
									tmt_tugas: values.tmt_tugas,
									sekolah_induk: values.sekolah_induk,
									keaktifan: values.keaktifan,
									keluar_karena: values.keluar_karena,
									tgl_keluar: values.tgl_keluar,
								},
							},
							callback: function (response) {
								if (response && !response.exc) {
									frappe.show_alert({
										message: "Data berhasil disimpan!",
										indicator: "green",
									});
									d.hide();
								}
							},
						});
					},
				});

				d.set_value("jenis_ptk", r.jenis_ptk);
				d.set_value("nomor_surat_tugas", r.nomor_surat_tugas);
				d.set_value("tanggal_surat_tugas", r.tanggal_surat_tugas);
				d.set_value("tmt_tugas", r.tmt_tugas);
				d.set_value("sekolah_induk", r.sekolah_induk);
				d.set_value("keaktifan", r.keaktifan);
				d.set_value("keluar_karena", r.keluar_karena);
				d.set_value("tgl_keluar", r.tgl_keluar);
				d.show();
			});
		},
	},
};
