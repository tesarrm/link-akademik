# Copyright (c) 2024, Tim SiakadPlus and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.integrations.utils import (
    make_get_request,
    make_post_request,
)


class DataBuku(Document):
	pass


@frappe.whitelist()
def get_data_buku():
    route = "https://api.data_buku.kemdikbud.go.id/api/catalogue/getPenggerakTextBooks?limit=2000&type_pdf"
    response = make_get_request(
        f"{route}",
    )
    return response['results']

@frappe.whitelist()
def sinkron_data_buku():
	data_buku =  get_data_buku()

	for b in data_buku:
		if not frappe.db.exists(
			"DataBuku", {"name": b['id'],}
		):
			doc = frappe.get_doc({
				"doctype": "DataBuku",
				"id_data_buku": b['id'],
				"penerbit": b['publisher'],
				"kelas": f"Kelas {b['class']} {b['level']}",
				"jenis": b['format'],
				"judul": b['title'],
			})
			doc.insert()
		else: 
			doc = frappe.get_doc(
				"DataBuku", {"name": b['id']}
			)
			doc.id_data_buku= b['id'],
			doc.penerbit= b['publisher']
			doc.kelas= f"Kelas {b['class']} {b['level']}"
			doc.jenis= b['format']
			doc.judul= b['title']
			doc.save(ignore_permissions = True)