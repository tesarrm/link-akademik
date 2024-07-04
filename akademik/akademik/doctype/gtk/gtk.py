# Copyright (c) 2024, Tim SiakadPlus and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class GTK(Document):
	pass

@frappe.whitelist()
def getGTK():
	data = frappe.get_all('GTK', fields=['*'])
	return data

@frappe.whitelist()
def buat_akun():
    frappe.msgprint("halo")
	# if(frm.doc.username):

# buat field button untuk create user
# ketika 'username', 'kata sandi', 'konfirmasi kata sandi' tidak kosong
# otomatis save data akun ke 'GTK'

