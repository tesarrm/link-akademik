// Copyright (c) 2024, Tim SiakadPlus and contributors
// For license information, please see license.txt

var data_options_kabkota = [
	[
		// Aceh
		"Kabupaten Aceh Barat",
        "Kabupaten Aceh Barat Daya",
        "Kabupaten Aceh Besar",
        "Kabupaten Aceh Jaya",
        "Kabupaten Aceh Selatan",
        "Kabupaten Aceh Singkil",
        "Kabupaten Aceh Tamiang",
        "Kabupaten Aceh Tengah",
        "Kabupaten Aceh Tenggara",
        "Kabupaten Aceh Timur",
        "Kabupaten Aceh Utara",
        "Kabupaten Bener Meriah",
        "Kabupaten Bireuen",
        "Kabupaten Gayo Lues",
        "Kabupaten Nagan Raya",
        "Kabupaten Pidie",
        "Kabupaten Pidie Jaya",
        "Kabupaten Simeulue",
        "Kota Banda Aceh",
        "Kota Langsa",
        "Kota Lhokseumawe",
        "Kota Sabang",
        "Kota Subulussalam",
	],
	[
		// Jawa Barat
		"Kabupaten Bandung",
        "Kabupaten Bandung Barat",
        "Kabupaten Bekasi",
        "Kabupaten Bogor",
        "Kabupaten Ciamis",
        "Kabupaten Cianjur",
        "Kabupaten Cirebon",
        "Kabupaten Garut",
        "Kabupaten Indramayu",
        "Kabupaten Karawang",
        "Kabupaten Kuningan",
        "Kabupaten Majalengka",
        "Kabupaten Pangandaran",
        "Kabupaten Purwakarta",
        "Kabupaten Subang",
        "Kabupaten Sukabumi",
        "Kabupaten Sumedang",
        "Kabupaten Tasikmalaya",
        "Kota Bandung",
        "Kota Banjar",
        "Kota Bekasi",
        "Kota Bogor",
        "Kota Cimahi",
		"Kota Cirebon",
        "Kota Depok",
        "Kota Sukabumi",
        "Kota Tasikmalaya",
	],
	[
		// Jawa Timur
		"Kabupaten Bangkalan",
        "Kabupaten Banyuwangi",
        "Kabupaten Blitar",
        "Kabupaten Bojonegoro",
        "Kabupaten Bondowoso",
        "Kabupaten Gresik",
        "Kabupaten Jember",
        "Kabupaten Jombang",
        "Kabupaten Kediri",
        "Kabupaten Lamongan",
        "	Kabupaten Lumajang",
        "Kabupaten Majalengka",
        "Kabupaten Pangandaran",
        "Kabupaten Purwakarta",
        "Kabupaten Subang",
        "Kabupaten Sukabumi",
        "Kabupaten Sumedang",
        "Kabupaten Tasikmalaya",
        "Kota Bandung",
        "Kota Banjar",
        "Kota Bekasi",
        "Kota Bogor",
        "Kota Cimahi",
		"Kota Cirebon",
        "Kota Depok",
        "Kota Sukabumi",
        "Kota Tasikmalaya",
	],
]


frappe.ui.form.on("Data Sekolah", {
  refresh(frm) {
    // permission Operator Sekolah
    let is_os= frappe.user_roles.includes('Operator Sekolah');
    frm.set_df_property('kompetensi_keahlian', 'read_only', is_os)
    //! permission Operator Sekolah

    update_jumlah_kamar_mandi(frm);
    update_jumlah_jamban_bisa(frm);
    update_jumlah_jamban_rusak(frm);
  },

  rincian_detail_cucitangan: function(frm) {
      open_custom_dialog(frm);
  },
  detailcuci_kamarmandi: function(frm) {
      open_custom_dialog1(frm);
  },

  map(frm) {
    console.log(JSON.parse(frm.doc.map));
    let mapdata = JSON.parse(frm.doc.map).features[0];
    if (mapdata) {
      frm.set_value("lintang", mapdata.geometry.coordinates[0]);
      frm.set_value("bujur", mapdata.geometry.coordinates[1]);
    }
  },

});

function open_custom_dialog(frm) {
    // Buat instance dialog baru
    let d = new frappe.ui.Dialog({
        title: 'Rincian Detail',
        fields: [
            {
                label: 'Field 1',
                fieldname: 'field1',
                fieldtype: 'HTML'
            }
        ],
        primary_action_label: 'Yes',
        primary_action(values) {
            d.hide();
        }
    });

    frappe.call({
        method: 'frappe.client.get_list',
        args: {
            doctype: 'Data Alat',// ganti dengan nama doctype yang ingin Anda ambil datanya
            filters: {
              "jenis_sarana": "Wastafel",
            },
            fields: ['ruang', 'jenis_sarana', 'nama'] // ganti dengan field-field yang ingin Anda tampilkan
        },
        callback: function(r) {
            if (r.message) {
                // Format data menjadi HTML
                let html_content = '<h5>Berikut detail rincian untuk wastafel : </h5>';
                let no = 1;
                html_content += "<p>"
                r.message.forEach(function(row) {
                  html_content += no++;
                  html_content += `. ${row.ruang} - (${row.jenis_sarana}) - ${row.nama}<br>`;
                });
                html_content += "</p>"

                // Set HTML content
                d.fields_dict.field1.$wrapper.html(html_content);
            }
        }
    });
    d.show();
}
function open_custom_dialog1(frm) {
    // Buat instance dialog baru
    let d = new frappe.ui.Dialog({
        title: 'Rincian Detail',
        fields: [
            {
                label: 'Field 1',
                fieldname: 'field1',
                fieldtype: 'HTML'
            }
        ],
        primary_action_label: 'Yes',
        primary_action(values) {
            d.hide();
        }
    });

    frappe.call({
        method: 'frappe.client.get_list',
        args: {
            doctype: 'Data Alat',// ganti dengan nama doctype yang ingin Anda ambil datanya
            filters: {
              "jenis_sarana": "Toilet",
            },
            fields: ['ruang', 'jenis_sarana', 'nama'] // ganti dengan field-field yang ingin Anda tampilkan
        },
        callback: function(r) {
            if (r.message) {
                // Format data menjadi HTML
                let html_content = '<h5>Berikut detail rincian untuk Toilet : </h5>';
                let no = 1;
                html_content += "<p>"
                r.message.forEach(function(row) {
                  html_content += no++;
                  html_content += `. ${row.ruang} - (${row.jenis_sarana}) - ${row.nama}<br>`;
                });
                html_content += "</p>"

                // Set HTML content
                d.fields_dict.field1.$wrapper.html(html_content);
            }
        }
    });
    d.show();
}

function update_jumlah_kamar_mandi(frm) {
  frappe.call({
    method: "frappe.client.get_list",
    args: {
      doctype: "Data Alat",
      filters: {
        "jenis_sarana": "Wastafel",
      },
      fields: ["nama"],
    },
    callback: function (r) {
      if (r.message) {
        frm.set_value("jlh_cuci_tangan", r.message.length);
      } else {
        frm.set_value("jlh_cuci_tangan", 0);
      }
    },
  });
}

function update_jumlah_jamban_bisa(frm) {
  frappe.call({
    method: "frappe.client.get_list",
    args: {
      doctype: "Data Alat",
      filters: {
        "jenis_sarana": "Toilet",
        "spesifikasi": "tidak"
      },
      fields: ["nama"],
    },
    callback: function (r) {
      if (r.message) {
        frm.set_value("jamban_l_bisa", r.message.length);
        frm.set_value("jamban_p_bisa", r.message.length);
        frm.set_value("jamban_b_bisa", r.message.length);
      } else {
        frm.set_value("jamban_l_bisa", 0);
        frm.set_value("jamban_p_bisa", 0);
        frm.set_value("jamban_b_bisa", 0);
      }
    },
  });
}

function update_jumlah_jamban_rusak(frm) {
  frappe.call({
    method: "frappe.client.get_list",
    args: {
      doctype: "Data Alat",
      filters: {
        "jenis_sarana": "Toilet",
        "spesifikasi": "rusak"
      },
      fields: ["nama"],
    },
    callback: function (r) {
      if (r.message) {
        frm.set_value("jamban_l_tidak", r.message.length);
        frm.set_value("jamban_p_tidak", r.message.length);
        frm.set_value("jamban_b_tidak", r.message.length);
      } else {
        frm.set_value("jamban_l_tidak", 0);
        frm.set_value("jamban_p_tidak", 0);
        frm.set_value("jamban_b_tidak", 0);
      }
    },
  });
}

frappe.ui.form.on("ctRelasi Dunia Industri", {
  map: function (frm, cdt, cdn) {
    let row = locals[cdt][cdn];
    let mapdata = JSON.parse(row.map).features[0];
    if (mapdata) {
      frappe.model.set_value(
        cdt,
        cdn,
        "lintang",
        mapdata.geometry.coordinates[0]
      );
      frappe.model.set_value(
        cdt,
        cdn,
        "bujur",
        mapdata.geometry.coordinates[1]
      );
    }
  },
});
