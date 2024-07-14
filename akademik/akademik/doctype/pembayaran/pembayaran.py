# pembayaran.py

from frappe.model.document import Document
import frappe

class Pembayaran(Document):
    pass

@frappe.whitelist()
def get_all_rombels():
    try:
        rombels = frappe.db.get_all('User', fields=['*'])
        if not rombels:
            frappe.log_error('No data found in Anggota Rombel', 'get_all_rombels')
        return rombels
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), 'get_all_rombels error')
        return {'error': str(e)}
