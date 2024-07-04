# Copyright (c) 2024, Tim SiakadPlus and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class TanahBangunan(Document):
	pass

def get_all_detail(doc):
    docs = frappe.get_all(doc)
    
    data = []
    for d in docs:
        a = frappe.get_doc(doc, d.name)
        data.append(a)

    return data


@frappe.whitelist()
def tanah_bangunan():
    tanah_bangunan = frappe.get_doc('Tanah Bangunan')
    bangunan = get_all_detail('Bangunan')
    tanah = get_all_detail('Tanah')
    tanah_nested = []
    tanah_nested2 = []

    for t in tanah:
        for n in tanah_bangunan.tanah:
            if t.name == n.tanah:
                tanah_nested.append(t)
    tanah_bangunan.tanah = tanah_nested

    for t in tanah:
        for n in tanah_bangunan.tanah:
            if t.name == n.name:
                bangunan_nested = []
                for b in bangunan:
                    for m in n.bangunan:
                        if b.name == m.bangunan:
                            bangunan_nested.append(b)
                n.bangunan = bangunan_nested
                tanah_nested2.append(n)
    tanah_bangunan.tanah = tanah_nested2

    return tanah_bangunan
