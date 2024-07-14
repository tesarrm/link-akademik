# pembayaran.py

from frappe.model.document import Document
import frappe

class Pembayaran(Document):
    pass

@frappe.whitelist()
def get_all_rombels():
    return frappe.get_all('Rombel', fields=['*'])
