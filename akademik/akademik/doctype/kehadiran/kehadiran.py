# Copyright (c) 2024, Tim SiakadPlus and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class Kehadiran(Document):
    def on_update(frm):
        sinkron_data_kehadiran()

def get_all_detail(doc):
    docs = frappe.get_all(doc)
    data = []
    for d in docs:
        a = frappe.get_doc(doc, d.name)
        data.append(a)

    return data

@frappe.whitelist()
def sinkron_data_kehadiran():
    kehadiran = frappe.get_doc("Kehadiran")
    for a in kehadiran.kehadiran:
        if not frappe.db.exists(
			"Data Kehadiran 2", {"rombel": a.rombel, "pembelajaran": a.pembelajaran, "tanggal": a.tanggal, "peserta_didik": a.peserta_didik}
		):
            doc = frappe.get_doc({
				"doctype": "Data Kehadiran 2",
				"rombel": a.rombel,
				"pembelajaran": a.pembelajaran,
				"tanggal": a.tanggal,
				"peserta_didik_id": a.peserta_didik_id,
				"peserta_didik": a.peserta_didik,
				"kehadiran": a.kehadiran,
			})
            doc.insert()
        else: 
            doc = frappe.get_doc(
				"Data Kehadiran 2", {"rombel": a.rombel, "pembelajaran": a.pembelajaran, "tanggal": a.tanggal, "peserta_didik": a.peserta_didik}
			)
            doc.rombel = a.rombel
            doc.pembelajaran = a.pembelajaran
            doc.tanggal = a.tanggal
            doc.peserta_didik_id= a.peserta_didik_id
            doc.peserta_didik= a.peserta_didik
            doc.kehadiran = a.kehadiran
            doc.save(ignore_permissions = True)

    return kehadiran.kehadiran
    
    # for a in rombel:
    #     if not frappe.db.exists(
	# 		"Jadwal", {"rombel": a.name}
	# 	):
    #         doc = frappe.get_doc({
	# 			"doctype": "Jadwal",
	# 			"rombel": a.name,
	# 			"ruang": a.ruang_kelas
	# 		})
    #         doc.insert()
    #     else: 
    #         doc = frappe.get_doc(
	# 			"Jadwal", {"rombel": a.name}
	# 		)
    #         doc.rombel = a.name
    #         doc.ruang = a.ruang_kelas
    #         doc.save(ignore_permissions = True)