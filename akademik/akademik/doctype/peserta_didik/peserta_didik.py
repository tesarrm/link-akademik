# Copyright (c) 2024, Tim SiakadPlus and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class PesertaDidik(Document):
	pass

# - cari file .py di dalam /doctype
# - bikin function terserah
# - bench restart setiap ada perubahan

@frappe.whitelist()
def getPesertaDidik():
    return {
		'total_rows' : len(frappe.get_all('PesertaDidik', fields=['*'])),
		'data' : frappe.get_all('PesertaDidik', fields=['*']),
        # 'data': data,
        # 'total_rows': total_rows
    }
	# return data


@frappe.whitelist()
def getPesertaDidiks(page=1, page_size=10):
    # Hitung offset
    start = (int(page) - 1) * int(page_size)

    # Ambil data dengan pagination
    data = frappe.get_all('PesertaDidik', fields=['*'], start=start, page_length=page_size)

    # Hitung total baris data
    total_rows = frappe.db.count('PesertaDidik')

    # Kembalikan hasil dalam format yang diinginkan
    return {
        'data': data,
        'total_rows': total_rows,
        'current_page': int(page),
        'page_size': int(page_size),
        'total_pages': (total_rows + int(page_size) - 1) // int(page_size)  # Pembulatan ke atas
    }
