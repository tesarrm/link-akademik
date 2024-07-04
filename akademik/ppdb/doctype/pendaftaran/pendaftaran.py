# Copyright (c) 2024, Tim SiakadPlus and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class Pendaftaran(Document):
	def on_submit(self):
		frappe.msgprint("halo bang")
