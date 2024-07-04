# Copyright (c) 2024, Tim SiakadPlus and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class WaliSiswa(Document):
	pass


@frappe.whitelist()
def getWaliSiswa():
	data = frappe.get_all('Wali Siswa', fields=['*'])
	return data


	
