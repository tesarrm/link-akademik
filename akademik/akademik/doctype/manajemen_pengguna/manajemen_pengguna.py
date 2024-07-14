# Copyright (c) 2024, Tim SiakadPlus and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class ManajemenPengguna(Document):
    def on_update(self):
        if not self.flags.ignore_update_user_roles:
            update_user_roles(self.email_pengguna, self.username, self.hak_akses, from_manajemen_pengguna=True)

# Function to get user data with relation in roles
@frappe.whitelist()
def get_user():
    pengguna_list = frappe.get_all('Manajemen Pengguna', fields=['*'])
    for pengguna in pengguna_list:
        pengguna_doc = frappe.get_doc('Manajemen Pengguna', pengguna.name)
        pengguna['hak_akses'] = pengguna_doc.hak_akses

    return pengguna_list

# Function to update roles in User doctype
def update_user_roles(email, username, hak_akses, from_manajemen_pengguna=True):
    try:
        user = frappe.get_doc('User', {'email': email, 'first_name': username})
        if user:
            user.roles = []
            for role in hak_akses:
                user.append('roles', {'role': role.get('role')})
            user.flags.ignore_update_user_roles = True
            user.save(ignore_permissions=True)

        if from_manajemen_pengguna:
            manajemen_pengguna_doc = frappe.get_doc('Manajemen Pengguna', {'email_pengguna': email, 'username': username})
            if manajemen_pengguna_doc:
                manajemen_pengguna_doc.hak_akses = hak_akses
                manajemen_pengguna_doc.flags.ignore_update_user_roles = True
                manajemen_pengguna_doc.save(ignore_permissions=True)
    except Exception as e:
        frappe.log_error(message=f"Error updating user roles: {str(e)}", title="User Role Update Error")
        raise frappe.ValidationError(f"Failed to update user roles: {str(e)}")
