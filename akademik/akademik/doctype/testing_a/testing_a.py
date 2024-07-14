# Copyright (c) 2024, Tim SiakadPlus and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class TestingA(Document):
    def on_update(self):
        data_dict = self.as_dict()
        data_str = str(data_dict)
        frappe.msgprint(msg=data_str, title="Document Data")









        # data = {
        #     "name": self.name,
        #     "doctype": self.doctype,
        #     # tambahkan atribut lain yang diperlukan
        # }