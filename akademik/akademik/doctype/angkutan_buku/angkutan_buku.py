# Copyright (c) 2024, Tim SiakadPlus and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class AngkutanBuku(Document):
	pass

def get_all_detail(doc):
    docs = frappe.get_all(doc)
    
    data = []
    for d in docs:
        a = frappe.get_doc(doc, d.name)
        data.append(a)

    return data

def ruang_detail(name):
    data = frappe.get_doc('Angkutan Buku')
    angkutan = get_all_detail('Item Angkutan')
    buku = get_all_detail('Pusat Buku')

    data_nested = []
    if name == "angkutan":
        for a in angkutan:
            for b in data.angkutan:
                if a.name == b.angkutan:
                    data_nested.append(a)
        return data_nested 
    if name == "buku":
        for a in buku:
            for b in data.buku:
                if a.name == b.buku:
                    data_nested.append(a)
        return data_nested 
    

@frappe.whitelist()
def angkutan_buku():
    data = frappe.get_doc('Angkutan Buku')
    data.angkutan = ruang_detail("angkutan")
    data.buku = ruang_detail("buku")

    return data 

@frappe.whitelist()
def sinkron_angkutan():
    data = get_all_detail("Data Angkutan")
    
    sgl_doc =  frappe.get_doc("Angkutan Buku")

    sgl_doc.angkutan= []
    for a in data:
        sgl_doc.append('angkutan', {
            'angkutan': a.name,
        })

    sgl_doc.save()