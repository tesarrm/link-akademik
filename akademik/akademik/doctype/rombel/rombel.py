# Copyright (c) 2024, Tim SiakadPlus and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class Rombel(Document):
    def on_update(self):
        sinkron_rombel_jadwal()

def get_all_detail(doc):
    docs = frappe.get_all(doc)
    data = []
    for d in docs:
        a = frappe.get_doc(doc, d.name)
        data.append(a)

    return data

def sinkron_rombel_jadwal():
    rombel = get_all_detail("Rombel")
    
    for a in rombel:
        if not frappe.db.exists(
			"Jadwal", {"rombel": a.name}
		):
            doc = frappe.get_doc({
				"doctype": "Jadwal",
				"rombel": a.name,
				"ruang": a.ruang_kelas
			})
            doc.insert()
        else: 
            doc = frappe.get_doc(
				"Jadwal", {"rombel": a.name}
			)
            doc.rombel = a.name
            doc.ruang = a.ruang_kelas
            doc.save(ignore_permissions = True)

@frappe.whitelist()
def get_rombel():
    pembelajaran = get_all_detail("Rombel")
    
    pembelajaran_merge = []
    
    for a in pembelajaran:
        for b in a.matpel_bidang_studi_wajib_tambahan_max_2jam:
            pembelajaran_merge.append(b)
        for b in a.matpel_muatan_nasional:
            pembelajaran_merge.append(b)
        for b in a.matpel_muatan_kewilayahan:
            pembelajaran_merge.append(b)
        for b in a.kompetensi_keahlian_c3:
            pembelajaran_merge.append(b)
        for b in a.matpel_lainnya:
            pembelajaran_merge.append(b)

        for c in pembelajaran_merge:
            if not frappe.db.exists(
				"Data Pembelajaran", {"rombel": a.name, "bidang_studi": c.bidang_studi}
			):
                doc = frappe.get_doc({
					"doctype": "Data Pembelajaran",
					"rombel": a.name,
					"bidang_studi": c.bidang_studi,
					"nama_bidang_studi": c.nama_bidang_studi,
					"ptk": c.ptk,
					"nama_guru": c.nama_guru
				})
                doc.insert()
            else: 
                doc = frappe.get_doc(
					"Data Pembelajaran", {"rombel": a.name, "bidang_studi": c.bidang_studi}
				)
                doc.rombel = a.name
                doc.bidang_studi = c.bidang_studi
                doc.nama_bidang_studi = c.nama_bidang_studi
                doc.ptk = c.ptk
                doc.nama_guru = c.nama_guru
                doc.save(ignore_permissions = True)

    return pembelajaran_merge