// Copyright (c) 2024, Tim SiakadPlus and contributors
// For license information, please see license.txt

frappe.ui.form.on("Data Bangunan", {
	hide_name_column: true,
	hide_name_filter: true,
	tambah_ruang(frm) {
		frappe.set_route("List", "Data Ruang");
	},
	refresh(frm) {
		// frm.set_value("tgl_sk_pemakai", "2024-01-01")
		frm.add_custom_button(__("Sinkron Ruang"), function () {
			frappe
				.call({
					method: "akademik.akademik.doctype.data_bangunan.data_bangunan.sinkron_ruang",
					callback: function (response) {
						if (response.message) {
							console.log(response);
						}
					},
				})
				.then(() => {
					frappe.show_alert({ message: "Sinkronisasi berhasil!", indicator: "green" });
					listview.refresh();
				});
		});
		frappe.call({
			method: "frappe.client.get_list",
			args: {
				doctype: "Data Ruang",
				filters: {
					bangunan: frm.doc.name,
				},
				fields: ["*"],
			},
			callback: function (r) {
				if (r.message) {
					console.log(r);
					// Clear existing tables
					frm.clear_table("ruang_kelas");
					frm.clear_table("ruang_kepsekguru");
					frm.clear_table("ruang_laboratorium");
					frm.clear_table("ruang_perpustakaan");
					frm.clear_table("ruang_praktik_siswa");
					frm.clear_table("kamar_mandiwc");
					frm.clear_table("ruang_penunjang");

					// Process retrieved data
					r.message.forEach(function (item) {
						var t = item.tipe;
						var child_table;

						if (t === "Ruang Teori/Kelas") {
							child_table = "ruang_kelas";
						} else if (t === "Ruang Kepsek/Guru") {
							child_table = "ruang_kepsekguru";
						} else if (t === "Ruang Laboratorium") {
							child_table = "ruang_laboratorium";
						} else if (t === "Ruang Perpustakaan") {
							child_table = "ruang_perpustakaan";
						} else if (t === "Ruang Praktik Siswa (RPS)") {
							child_table = "ruang_praktik_siswa";
						} else if (t === "Kamar Mandi/WC") {
							child_table = "kamar_mandiwc";
						} else {
							child_table = "ruang_penunjang";
						}

						var child = frm.add_child(child_table);
						[
							"link",
							"bangunan_nama",
							"nama_ruang",
							"jenis_prasarana",
							"kode_ruang",
							"registrasi_ruang",
							"lantai_ke",
							"panjang_m",
							"lebar_m",
							"luas_ruang_m2",
							"kapasitas",
							"kerusakan",
							"nilai_kerusakan",
						].forEach(function (field) {
							if (field == "link") {
								child[field] = item["name"];
							} else {
								child[field] = item[field];
							}
						});
					});

					// Refresh fields
					frm.refresh_field("ruang_kelas");
					frm.refresh_field("ruang_kepsekguru");
					frm.refresh_field("ruang_laboratorium");
					frm.refresh_field("ruang_perpustakaan");
					frm.refresh_field("ruang_praktik_siswa");
					frm.refresh_field("kamar_mandiwc");
					frm.refresh_field("ruang_penunjang");
				}
			},
		});
		breadcrumbs(frm);
	}, // end refresh
});

function breadcrumbs(frm) {
	frappe.breadcrumbs.clear();

	frappe.breadcrumbs.set_custom_breadcrumbs({
		label: "Akademik",
		route: "/app/akademik",
	});
	frappe.breadcrumbs.set_custom_breadcrumbs({
		label: "Data Bangunan",
		route: "/app/data-bangunan/view/list",
	});
	if (frm.doc.nama) {
		frappe.breadcrumbs.set_custom_breadcrumbs({
			label: frm.doc.nama,
		});
	} else {
		frappe.breadcrumbs.set_custom_breadcrumbs({
			label: "Buat Bangunan",
		});
	}
}
