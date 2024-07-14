// Copyright (c) 2024, Tim SiakadPlus and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Jadwal", {
// 	refresh(frm) {
//         frm.fields_dict['jadwal_senin'].grid.get_field('pembelajaran').df.options = [
//             "Option 1",
//             "Option 2",
//             "Option 3"
//         ];
// 	},
// });

frappe.ui.form.on('Jadwal',  {
    refresh: function(frm) {
        breadcrumbs(frm, "jadwal", frm.doc.nama_rombel)
        frm.set_query("pembelajaran", "jadwal_senin", function (doc, cdt, cdn) {
          return {
            "filters": {
              "rombel": frm.doc.rombel,
              "ptk": ['!=', '']
            },
          };
        });
        frm.set_query("pembelajaran", "jadwal_selasa", function (doc, cdt, cdn) {
          return {
            "filters": {
              "rombel": frm.doc.rombel,
              "ptk": ['!=', '']
            },
          };
        });
        frm.set_query("pembelajaran", "jadwal_rabu", function (doc, cdt, cdn) {
          return {
            "filters": {
              "rombel": frm.doc.rombel,
              "ptk": ['!=', '']
            },
          };
        });
        frm.set_query("pembelajaran", "jadwal_kamis", function (doc, cdt, cdn) {
          return {
            "filters": {
              "rombel": frm.doc.rombel,
              "ptk": ['!=', '']
            },
          };
        });
        frm.set_query("pembelajaran", "jadwal_jumat", function (doc, cdt, cdn) {
          return {
            "filters": {
              "rombel": frm.doc.rombel,
              "ptk": ['!=', '']
            },
          };
        });
        frm.set_query("pembelajaran", "jadwal_sabtu", function (doc, cdt, cdn) {
          return {
            "filters": {
              "rombel": frm.doc.rombel,
              "ptk": ['!=', '']
            },
          };
        });
        frm.set_query("pembelajaran", "jadwal_minggu", function (doc, cdt, cdn) {
          return {
            "filters": {
              "rombel": frm.doc.rombel,
              "ptk": ['!=', '']
            },
          };
        });
    }
});