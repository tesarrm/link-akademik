# pembayaran.py

from frappe.model.document import Document
import frappe

class Pembayaran(Document):
    pass

@frappe.whitelist()
def get_all_rombels():
    return frappe.get_all('Rombel', fields=['*'])


@frappe.whitelist()
def get_anggota_by_rombel(rombel):
    return frappe.get_all('Anggota Rombel', filters={'rombel': rombel}, fields=['*'])

@frappe.whitelist()
def get_peserta_didik_by_rombel(rombel):
    return frappe.get_all('Peserta Didik', filters={'rombel': rombel}, fields=['*'])

@frappe.whitelist()
def get_peserta_didik_by_rombel(rombel):
    if isinstance(rombel, list):
        return frappe.get_all('Peserta Didik', filters={'rombel': ['in', rombel]}, fields=['*'])
    else:
        return frappe.get_all('Peserta Didik', filters={'rombel': rombel}, fields=['*'])