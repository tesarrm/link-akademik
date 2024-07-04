# Copyright (c) 2024, Tim SiakadPlus and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class AlatIntance(Document):
	pass

def get_all_detail(doc):
    docs = frappe.get_all(doc)
    
    data = []
    for d in docs:
        a = frappe.get_doc(doc, d.name)
        data.append(a)

    return data

@frappe.whitelist()
def alat_all_detail(name=None):
    data = get_all_detail('Alat Intance')
    data_alat = get_all_detail('Item Alat Intance')
    ruangan = get_all_detail('Ruangan')
    data_nested = []

    for d in data:
        ruang = {} 
        for r in ruangan:
            if d.ruang == r.name:
                ruang = r
        d.ruang = ruang

        alat_nested = []
        for a in data_alat:
            for b in d.alat:
                if a.name == b.alat:
                    alat_nested.append(a)
        d.alat = alat_nested 
        data_nested.append(d)
    if name:
        result = [item for item in data if item.name == name]
        return result[0] if result else None
    else:
        return data_nested
