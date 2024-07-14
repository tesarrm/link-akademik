# Copyright (c) 2024, Tim SiakadPlus and contributors
# For license information, please see license.txt

import frappe
import copy
from frappe.model.document import Document


class DataSekolah(Document):
    def on_update(frm):
        sinkron_data_kompetensi_keahlian()

# @frappe.whitelist()
# def sinkron_data_kompetensi_keahlian():
#     data = frappe.get_doc("Data Sekolah")
#     to_doc_name = "Data Kompetensi Keahlian"

#     for a in data.kompetensi_keahlian:
#         kompetensi_keahlian_fields = {fieldname: getattr(a, fieldname) for fieldname in a.as_dict().keys()}

#         if not frappe.db.exists(
# 			to_doc_name, {
# 				"kompetensi_keahlian": a.kompetensi_keahlian,
# 				"kurikulum": a.kurikulum,
#     		}
# 		):
#             doc = frappe.get_doc({
# 				"doctype": to_doc_name,
# 				**kompetensi_keahlian_fields
# 			})
#             doc.insert()
#         else: 
#             doc = frappe.get_doc(
# 				to_doc_name, {
# 					"kompetensi_keahlian": a.kompetensi_keahlian,
# 					"kurikulum": a.kurikulum,
# 				}
# 			)
#             doc.update(kompetensi_keahlian_fields)
#             doc.save(ignore_permissions = True)
    
@frappe.whitelist()
def sinkron_data_kompetensi_keahlian():
    data = frappe.get_doc("Data Sekolah")
    to_doc_name = "Data Kompetensi Keahlian"

    for a in data.kompetensi_keahlian:
        if not frappe.db.exists(
            to_doc_name, {
                "kompetensi_keahlian": a.kompetensi_keahlian,
            }
        ):
            # Buat dokumen baru
            doc = frappe.get_doc({
                "doctype": to_doc_name,
				"bidang_keahlian": a.bidang_keahlian,
				"program_keahlian": a.program_keahlian,
				"kompetensi_keahlian": a.kompetensi_keahlian,
				"nama_jurusan_satuan_pendidikan": a.nama_jurusan_satuan_pendidikan,
				"no_sk_izin": a.no_sk_izin,
				"tgl_sk_izin": a.tgl_sk_izin,
				"jumlah_pendaftar_hanya_kelas_x": a.jumlah_pendaftar_hanya_kelas_x,
				"kurikulum": a.kurikulum,
            })
            doc.insert()
        else:
            # Update dokumen yang sudah ada
            doc = frappe.get_doc(
                to_doc_name, {
                    "kompetensi_keahlian": a.kompetensi_keahlian,
                }
            )
            doc.bidang_keahlian = a.bidang_keahlian 
            doc.program_keahlian = a.program_keahlian 
            doc.kompetensi_keahlian = a.kompetensi_keahlian 
            doc.nama_jurusan_satuan_pendidikan = a.nama_jurusan_satuan_pendidikan 
            doc.no_sk_izin = a.no_sk_izin 
            doc.tgl_sk_izin = a.tgl_sk_izin 
            doc.jumlah_pendaftar_hanya_kelas_x = a.jumlah_pendaftar_hanya_kelas_x 
            doc.kurikulum = a.kurikulum 
            doc.bidang_keahlian = a.bidang_keahlian
            doc.save(ignore_permissions=True)