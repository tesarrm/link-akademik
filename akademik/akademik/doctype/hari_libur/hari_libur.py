# Copyright (c) 2024, Tim SiakadPlus and contributors
# For license information, please see license.txt

import frappe
import requests
from frappe.model.document import Document


class HariLibur(Document):
	pass


@frappe.whitelist()
def get_hari_libur():
    route = "https://api-harilibur.vercel.app/api"
    response = requests.get(route)
    if response.status_code == 200:
        return response.json()
    else:
        frappe.throw("Gagal mendapatkan data hari libur dari API.")


@frappe.whitelist()
def getAll():
    data = frappe.get_all('Hari Libur', fields=['*'])
    return data


@frappe.whitelist()
def sinkron_hariliburnasional():
    libur_nasional = get_hari_libur()

    for libur in libur_nasional:
        # Memeriksa apakah hari libur dengan tanggal tertentu sudah ada di database
        if not frappe.db.exists("Hari Libur", {"tanggal": libur['holiday_date']}):
            # Jika hari libur belum ada, buat dokumen baru
            doc = frappe.get_doc({
                "doctype": "Hari Libur",
                "tanggal": libur['holiday_date'],
                "libur": libur['holiday_name'],
            })
            doc.insert()
        else:
            # Jika hari libur sudah ada, ambil dokumen tersebut
            doc = frappe.get_doc("Hari Libur", {"tanggal": libur['holiday_date']})
            # Perbarui informasi pada dokumen yang sudah ada
            doc.libur = libur['holiday_name']
            doc.save(ignore_permissions=True)
