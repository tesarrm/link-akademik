# Copyright (c) 2024, Tim SiakadPlus and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.integrations.utils import (
    make_get_request,
    make_post_request,
)
import requests
from datetime import datetime

class hariliburnasional(Document):
	pass

@frappe.whitelist()
def get_hari_libur():
    route = " https://dayoffapi.vercel.app/api/"
    response = make_get_request(
        f"{route}",
    )
    return response

@frappe.whitelist()
def sinkron_hariliburnasional():
    libur_nasional = get_hari_libur()

    for b in libur_nasional:
        if not frappe.db.exists("Hari Libur", {"tanggal": b['tanggal']}):
            doc = frappe.get_doc({
                "doctype": "Hari Libur",
                "tanggal": b['tanggal'],
                "libur": b['libur'],
            })
            doc.insert()
        else:
            doc = frappe.get_doc("Hari Libur", {"tanggal": b['tanggal']})
            doc.libur = b['libur']
            doc.save(ignore_permissions=True)

def get_external_data():
    try:
        # Panggil API eksternal
        response = requests.get('https://dayoffapi.vercel.app/api/')
        data = response.json()
        return data
    except Exception as e:
        frappe.log_error(f"Error fetching external data: {str(e)}")
        return None

@frappe.whitelist(allow_guest=True)
def get_holidays():
    url = 'https://dayoffapi.vercel.app/api/'  # Ganti dengan endpoint API yang Anda inginkan

    try:
        response = requests.get(url)
        if response.status_code == 200:
            holidays = response.json()

            # Proses data libur (opsional)
            processed_holidays = []
            for holiday in holidays:
                processed_holidays.append({
                    'tanggal': datetime.strptime(holiday['date'], '%Y-%m-%d').date(),
                    'keterangan': holiday['name'],
                    'is_cuti': holiday['type'] == 'public'
                })

            return processed_holidays
        else:
            frappe.throw(f"Gagal mengambil data libur: {response.status_code}")
    except Exception as e:
        frappe.throw(f"Error: {str(e)}")
