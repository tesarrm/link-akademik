# Copyright (c) 2024, Tim SiakadPlus and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class DataAlat(Document):
    pass
    # def on_update(self):
    #     sinkron_alat()
    # def on_trash(self, doc):
    #     related_alat = frappe.get_all('Alat', filters={'alat': doc.name}, fields=['name'])
    #     for alat in related_alat:
    #     	frappe.delete_doc('Alat', alat.name, force=1)
     
# auto delete

def get_all_detail(doc):
    docs = frappe.get_all(doc)

    data = []
    for d in docs:
        a = frappe.get_doc(doc, d.name)
        data.append(a)

    return data

@frappe.whitelist()
def sinkron_alat():
    data_ruang = get_all_detail("Data Ruang")
    data_alat = get_all_detail("Data Alat")
    alat = get_all_detail("Alat")

    
    # filter arr Data Alat by Ruang
    for a in data_ruang:
        arr_r = []
        for b in data_alat:
            if a.name == b.ruang:
                arr_r.append(b)

        # formatting array
        arr_x = []
        for x in arr_r:
            arr_x.append({
                "alat": x.name
            })

        # update Data Alat to child Ruang 
        doc = frappe.get_doc(
            "Data Ruang", {"name": a.name}
        )
        doc.update({
            "alat": arr_x
        })
        doc.save(ignore_permissions=True)

        doc2 = frappe.get_doc(
            "Alat", {"ruang": a.name}
        )
        doc2.update({
            "alat": arr_x
        })
        doc2.save(ignore_permissions=True)
