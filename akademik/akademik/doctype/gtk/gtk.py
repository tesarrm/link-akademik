# Copyright (c) 2024, Tim SiakadPlus and contributors
# For license information, please see license.txt

import frappe
import string
import random
from frappe.model.document import Document
import logging

# Konfigurasi logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')


class GTK(Document):
	pass

@frappe.whitelist()
def getGTK():
	data = frappe.get_all('GTK', fields=['*'])
	return data
    # all_data = []
    # # Mengambil semua dokumen GTK
    # gtk_docs = frappe.get_all('GTK', fields=['name'])

    # for gtk in gtk_docs:
    #     # Mengambil data lengkap dari setiap dokumen GTK termasuk tabel anak
    #     doc = frappe.get_doc('GTK', gtk['name'])
    #     data = doc.as_dict()

    #     # Anda juga dapat secara eksplisit mengakses data dari section yang collapsible
    #     if hasattr(doc, 'kontak_section'):
    #         data['kontak_section'] = doc.kontak_section

    #     all_data.append(data)

    # return all_data

@frappe.whitelist()
def generateAccount(selected_users):
    try:
        logging.info(f"Selected users: {selected_users}")
        selected_users = frappe.parse_json(selected_users)

        def generate_random_code(length=8):
            characters = string.ascii_letters + string.digits + string.punctuation
            random_code = ''.join(random.choice(characters) for _ in range(length))
            return random_code

        for user in selected_users:
            email = user.get("email")
            if not frappe.db.exists("User", email):
                frappe.logger().info(f"Creating user for email: {email}")

                # Generate random password
                random_password = generate_random_code()
                logging.info(f"User berhasil dibuat dengan email: {email} dan password: {random_password}")

                # Insert to doctype user
                user_doc = frappe.get_doc({
                    "doctype": "User",
                    "email": email,
                    "first_name": user.get("username"),
                    "gender": user.get("jenis_kelamin"),
                    "roles": [
                        {
                            "role": "PTK"
                        }
                    ],
                    "send_welcome_email": 0,
                })
                user_doc.insert(ignore_permissions=True)
                frappe.utils.password.update_password(email, random_password)

                # Insert to doctype manajemen pengguna
                manajemen_pengguna_doc = frappe.get_doc({
                    "doctype": "Manajemen Pengguna",
                    "email_pengguna": email,
                    "username": user.get("username"),
                    "jenis_pengguna": "PTK",
                    "hak_akses": [
                        {
                            "role": "PTK"
                        }
                    ]
                })
                manajemen_pengguna_doc.insert(ignore_permissions=True)

        return {"status": "success", "message": "Berhasil membuat akun"}

    except Exception as e:
        frappe.log_error(f"Error creating user accounts: {str(e)}")
        raise frappe.ValidationError(f"Failed to create user accounts: {str(e)}")
# buat field button untuk create user
# ketika 'username', 'kata sandi', 'konfirmasi kata sandi' tidak kosong
# otomatis save data akun ke 'GTK'



