// Copyright (c) 2024, Tim SiakadPlus and contributors
// For license information, please see license.txt

var data_options = [
    [
        'Ruang Teori/Kelas'
    ],
    [
        "Ruang Guru",
        "Ruang Kepala Sekolah"
    ],
    [
        "Ruang Laboratorium"
    ],
    [
        "Ruang Perpustakaan"
    ],
    [
        "RPS Agribisnis Ikan Hias",
        "RPS Agribisnis Organik Ekologi",
        "RPS Agribisnis Pengolahan Hasil Perikanan",
        "RPS Agribisnis Pengolahan Hasil Pertanian",
        "RPS Agribisnis Perikanan Air Payau dan Laut",
        "RPS Agribisnis Perikanan Air Tawar",
        "RPS Agribisnis Rumput Laut",
        "RPS Agribisnis Tanaman Pangan dan Hortikultura",
        "RPS Agribisnis Tanaman Perkebunan",
        "RPS Agribisnis Ternak Ruminansia",
        "RPS Agribisnis Ternak Unggas",
        "RPS Agribisnis Agroindustri",
        "RPS Airframe Power Plant",
        "RPS Akuntansi dan Keuangan Lembaga",
        "RPS Alat Mesin Pertanian",
        "RPS Analisis Pengujian Laboratorium",
        "RPS Animasi",
        "RPS Asisten Keperawatan",
        "RPS Bisnis Daring dan Pemasaran",
        "RPS Bisnis Konstruksi dan Properti",
        "RPS Caregiver",
        "RPS Dental Asisten",
        "RPS Desain dan Rancang Bangun Kapal",
        "RPS Desain Fesyen",
        "RPS Desain Grafika",
        "RPS Desain Interior dan Teknik Furnitur",
        "RPS Desain Komunikasi Visual",
        "RPS Desain Pemodelan dan Informasi Bangunan",
        "RPS Electrical Avionics",
        "RPS Elektronika Pesawat Udara",
        "RPS Keperawatan Hewan",
        "RPS Kesehatan dan Reproduksi Hewan",
        "RPS Kimia Analisis",
        "RPS Kimia Industri",
        "RPS Kimia Tekstil",
        "RPS Konstruksi Badan Pesawat Udara",
        "RPS Konstruksi Gedung, Sanitasi, dan Perawatan",
        "RPS Konstruksi Jalan, Irigasi, dan Jembatan",
    ],
    [
        "Kamar Mandi/WC"
    ],
    [
        "Gudang",
        "Kantin",
        "Koperasi Toko",
        "Ruang Bina Diri",
        "Ruang Bina Diri dan Bina Gerak",
        "Ruang Bina Persepsi Bunyi dan Irama",
        "Ruang Bina Pribadi dan Sosial",
        "Ruang Bina Wicara",
        "Ruang BP/BK",
        "Ruang Diesel",
        "Ruang Gambar",
        "Ruang Ibadah",
        "Ruang Keterampilan",
        "Ruang Konseling/Asesmen",
        "Ruang Maya",
        "Ruang Multimedia",
        "Ruang Olahraga",
        "Ruang Orientasi dan Mobilitas (OM)",
        "Ruang Pameran",
        "Ruang Perawatan/Perbaikan Sarana dan Prasarana",
        "Ruang Pusat Belajar Guru",
        "Ruang Pusat Pendidikan Inklusi",
        "Ruang Serba Guna/Aula",
        "Ruang Sirkulasi",
        "Ruang Terapi",
        "Ruang TU",
        "Ruang UKS",
        "Ruang Wakil Kepala Sekolah",
        "Sanggar MGMP",
        "Unit Produksi",
    ]
]

frappe.ui.form.on("Data Ruang", {
    onload: function(frm) {
        frm.trigger('trigger_jenis_prasarana');
    },
    tipe: function(frm) {
        frm.trigger('trigger_jenis_prasarana');
    },
    trigger_jenis_prasarana: function(frm) {
        var dependent_value = frm.doc.tipe;

        if (dependent_value === 'Ruang Teori/Kelas') {
            options = data_options[0];
        } else if (dependent_value === 'Ruang Kepsek/Guru') {
            options = data_options[1];
        } else if (dependent_value === 'Ruang Laboratorium') {
            options = data_options[2];
        } else if (dependent_value === 'Ruang Perpustakaan') {
            options = data_options[3];
        } else if (dependent_value === 'Ruang Praktik Siswa (RPS)') {
            options = data_options[4];
        } else if (dependent_value === 'Kamar Mandi/WC') {
            options = data_options[5];
        } else if (dependent_value === 'Ruang Penunjang') {
            options = data_options[6];
        } else {
            options = "";
        }

        if(options){
            frm.set_df_property('jenis_prasarana', 'options', options.join('\n'));
            frm.set_value('jenis_prasarana', options);
        }
    },
    tambah_alat(frm){
        frappe.set_route('List', 'Data Alat');
    },
	refresh(frm) {
        frappe.call({
            method: 'frappe.client.get_list',
            args: {
                doctype: "Data Alat",
                filters: {
                    ruang: frm.doc.name
                },
                fields: ["*"] 
            },
            callback: function(r) {
                if (r.message) {
                    console.log(r)
                    // Clear existing tables
                    frm.clear_table("alat");

                    // Process retrieved data
                    r.message.forEach(function(item) {
                        var child_table = "alat";

                        var child = frm.add_child(child_table);
                        ['link','nama', 'bangunan', 'ruang', 'jenis_sarana', 'nama', 'spesifikasi', 'kepemilikan',
                        'jumlah_total', 'jumlah_layak', 'nama_ruang']
                        .forEach(function(field) {
                            if(field == "link"){
                                child[field] = item["name"];
                            }else{
                                child[field] = item[field];
                            }
                        });
                    });

                    // Refresh fields
                    frm.refresh_field("alat");
                }
            }
        });
        breadcrumbs(frm)
	},
    // tambah_alat(frm){
    //     let ruang_name = frm.doc.name; 
    //     if (ruang_name) {
    //         window.location.href = `/app/data-ruang/${ruang_name}#alat_tab`;
    //     } else {
    //         frappe.msgprint(__('Nama ruang tidak ditemukan.'));
    //     }
    // }
});


function breadcrumbs(frm){
    frappe.breadcrumbs.clear();
    
    frappe.breadcrumbs.set_custom_breadcrumbs({
        label: "Akademik", 
        route: '/app/akademik',
    });
    frappe.breadcrumbs.set_custom_breadcrumbs({
        label: "Data Ruang",
        route: '/app/data-ruang/view/list',
    });               
    if(frm.doc.nama_ruang){
        frappe.breadcrumbs.set_custom_breadcrumbs({
            label: frm.doc.nama_ruang,
        });               
    } else {
        frappe.breadcrumbs.set_custom_breadcrumbs({
            label: "Buat Angkutan",
        });               
    }
}
