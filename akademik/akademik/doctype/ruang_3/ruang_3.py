# Copyright (c) 2024, Tim SiakadPlus and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class Ruang3(Document):
	pass

def get_all_detail(doc):
    docs = frappe.get_all(doc)

    data = []
    for d in docs:
        a = frappe.get_doc(doc, d.name)
        data.append(a)

    return data

def ruang_3_detail(name):
    data = frappe.get_doc('Ruang3')
    ruang_3an = get_all_detail('Ruang3an')

    ruang_3_nested = []
    if name == "kelas":
        for r in ruang_3an:
            for d in data.kelas:
                if r.name == d.ruang_3_kelas:
                    ruang_3_nested.append(r)
        return ruang_3_nested
    if name == "laboratorium":
        for r in ruang_3an:
            for d in data.laboratorium:
                if r.name == d.ruang_3_laboratorium:
                    ruang_3_nested.append(r)
        return ruang_3_nested
    if name == "kepsek_guru":
        for r in ruang_3an:
            for d in data.kepsek_guru:
                if r.name == d.ruang_3_kepsekguru:
                    ruang_3_nested.append(r)
        return ruang_3_nested
    if name == "kamar_mandi":
        for r in ruang_3an:
            for d in data.kamar_mandi:
                if r.name == d.kamar_mandiwc:
                    ruang_3_nested.append(r)
        return ruang_3_nested
    if name == "perpustakaan":
        for r in ruang_3an:
            for d in data.perpustakaan:
                if r.name == d.ruang_3_perpustakaan:
                    ruang_3_nested.append(r)
        return ruang_3_nested
    if name == "penunjang":
        for r in ruang_3an:
            for d in data.penunjang:
                if r.name == d.ruang_3_penunjang:
                    ruang_3_nested.append(r)
        return ruang_3_nested


@frappe.whitelist()
def ruang_3():
    data = frappe.get_doc('Ruang3')
    data.kelas = ruang_3_detail("kelas")
    data.laboratorium = ruang_3_detail("laboratorium")
    data.kepsek_guru= ruang_3_detail("kepsek_guru")
    data.kamar_mandi= ruang_3_detail("kamar_mandi")
    data.perpustakaan= ruang_3_detail("perpustakaan")
    data.penunjang= ruang_3_detail("penunjang")

    return data

def get_all_detail(doc):
    docs = frappe.get_all(doc)

    data = []
    for d in docs:
        a = frappe.get_doc(doc, d.name)
        data.append(a)

    return data

"""
STEP
- [done] get "Data Ruang3" 
- [done] insert "Data Ruang3" sesuai tipe/jenis prasarana pada tab "Ruang3"
- [done] validasi jika sudah ada maka update (barang kali ada yang di hapus)
"""
@frappe.whitelist()
def sinkron_ruang_3():
    data_ruang_3 = get_all_detail("Data Ruang3")
    
    ruang_3 =  frappe.get_doc("Ruang3")


    ruang_3.kelas = []
    ruang_3.kamar_mandi= []
    ruang_3.kepsek_guru= []
    ruang_3.laboratorium= []
    ruang_3.penunjang= []
    ruang_3.perpustakaan= []
    for a in data_ruang_3:
        if a.jenis_prasarana == "Ruang3 Teori/Kelas":
            ruang_3.append('kelas', {
                'ruang_3_kelas': a.name,
            })
        if a.jenis_prasarana == "Kamar Mandi/WC":
            ruang_3.append('kamar_mandi', {
                'kamar_mandiwc': a.name,
            })
        if a.jenis_prasarana == "Ruang3 Kepsek/Guru":
            ruang_3.append('kepsek_guru', {
                'ruang_3_kepsekguru': a.name,
            })
        if a.jenis_prasarana == "Ruang3 Laboratorium":
            ruang_3.append('laboratorium', {
                'ruang_3_laboratorium': a.name,
            })
        if a.jenis_prasarana == "Ruang3 Penunjang":
            ruang_3.append('penunjang', {
                'ruang_3_penunjang': a.name,
            })
        if a.jenis_prasarana == "Ruang3 Perpustakaan":
            ruang_3.append('perpustakaan', {
                'ruang_3_perpustakaan': a.name,
            })

    ruang_3.save()