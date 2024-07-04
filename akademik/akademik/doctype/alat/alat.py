# Copyright (c) 2024, Tim SiakadPlus and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class Alat(Document):
	pass

def get_all_detail(doc):
    docs = frappe.get_all(doc)
    
    data = []
    for d in docs:
        a = frappe.get_doc(doc, d.name)
        data.append(a)

    return data

@frappe.whitelist()
def sinkron_ruang():
    ruang = get_all_detail("Data Ruang")
    
    for a in ruang:
        if not frappe.db.exists(
			"Alat", {"ruang": a.name}
		):
            doc = frappe.get_doc({
				"doctype": "Alat",
				"ruang": a.name,
				"bangunan": a.bangunan_nama
			})
            doc.insert()
        else:
            doc = frappe.get_doc(
				"Alat", {"ruang": a.name}
			)
            doc.ruang = a.name
            doc.bangunan = a.bangunan_nama
            doc.save(ignore_permissions = True)
      
