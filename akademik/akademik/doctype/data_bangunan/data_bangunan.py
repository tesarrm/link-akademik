# Copyright (c) 2024, Tim SiakadPlus and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class DataBangunan(Document):
	pass

def get_all_detail(doc):
    docs = frappe.get_all(doc)

    data = []
    for d in docs:
        a = frappe.get_doc(doc, d.name)
        data.append(a)

    return data

"""
- get all ruang
- insert ruang berdasar relasi dengan data_bangunan 
	- seperti 2 relasi: data_bangunan relasi dengan ruang, ruang relasi dengan data_bangunan
	- namun proses tambah ruang ada di Data Ruang dengan relasi data_bangunannya. Setelah itu auto sinkron di DataBangunan dan Ruang
	- jadi DataBangunan child table ruang dan Ruang hanya tampilan saja
- hanya satu proses insert di Data Ruang, maka semuanya akan sinkron di DataBangunan dan Ruang
"""

@frappe.whitelist()
def sinkron_ruang():
    ruang = get_all_detail("Data Ruang")
    bangunan = get_all_detail("Data Bangunan")

    
    # filter arr Ruang by Banguanan
    for a in bangunan:
        arr_r = []
        for b in ruang:
            if a.name == b.bangunan:
                arr_r.append(b)

        # formatting array
        arr_x = []
        for x in arr_r:
            arr_x.append({
                "ruang": x.name
            })

        # update Ruang to child Bangunan
        doc = frappe.get_doc(
            "Data Bangunan", {"name": a.name}
        )
        doc.update({
            "ruang": arr_x
        })
        doc.save(ignore_permissions=True)
    
        