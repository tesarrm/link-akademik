# Copyright (c) 2024, Tim SiakadPlus and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class DataRuang(Document):
    pass


def get_all_detail(doc):
    docs = frappe.get_all(doc)

    data = []
    for d in docs:
        a = frappe.get_doc(doc, d.name)
        data.append(a)

    return data

"""
- get all alat from child table Ruang 
- insert ruang berdasar relasi dengan data_bangunan 
	- seperti 2 relasi: data_bangunan relasi dengan ruang, ruang relasi dengan data_bangunan
	- namun proses tambah ruang ada di Data Ruang dengan relasi data_bangunannya. Setelah itu auto sinkron di DataBangunan dan Ruang
	- jadi DataBangunan child table ruang dan Ruang hanya tampilan saja
- hanya satu proses insert di Data Ruang, maka semuanya akan sinkron di DataBangunan dan Ruang
"""


# @frappe.whitelist()
# def sinkron_alat():
#     ruang = get_all_detail("Data Ruang")
#     ruang_alat = get_all_detail("Alat")
    
#     for a in ruang:
#         for b in ruang_alat:
#             if a.name == b.ruang:
#                 doc = frappe.get_doc(
#                     "Data Ruang", {"name": a.name}
#                 )
#                 doc.update({
#                     "alat": b.alat 
#                 })
#                 doc.save(ignore_permissions=True)


# @frappe.whitelist()
# def sinkron_alat2():
#     ruang = get_all_detail("Data Ruang")
#     ruang_alat = get_all_detail("Alat")
    
#     for a in ruang_alat:
#         for b in ruang:
#             if a.ruang == b.name:
#                 doc = frappe.get_doc(
#                     "Alat", {"ruang": a.ruang}
#                 )
#                 doc.update({
#                     "alat": b.alat 
#                 })
#                 doc.save(ignore_permissions=True)



## ===================
## ===================
def insert_alat_angkutan_buku(self):
    if not frappe.db.exists(
        "Alat Angkutan Buku", {
            "bangunan": self.bangunan,
            "raung": self.name
        }
    ):
        doc = frappe.get_doc({
            "doctype": "Angkutan Buku",
            "bangunan": self.bangunan,
            "ruang": self.name,
        })
        doc.insert()
    else: 
        doc = frappe.get_doc(
            "Angkutan Buku", {"name": self.name}
        )
        doc.bangunan = self.bangunan
        doc.ruang = self.name
        doc.save(ignore_permissions = True)


# On first time insert will triged
# Before Insert Triggered
# Validation Triggered
# Before Save Triggered
# After Insert Triggered
# On Update Triggered