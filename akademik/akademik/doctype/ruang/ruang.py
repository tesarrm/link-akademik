# Copyright (c) 2024, Tim SiakadPlus and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class Ruang(Document):
	pass

def get_all_detail(doc):
    docs = frappe.get_all(doc)

    data = []
    for d in docs:
        a = frappe.get_doc(doc, d.name)
        data.append(a)

    return data

def ruang_detail(name):
    data = frappe.get_doc('Ruang')
    ruangan = get_all_detail('Ruangan')

    ruang_nested = []
    if name == "kelas":
        for r in ruangan:
            for d in data.kelas:
                if r.name == d.ruang_kelas:
                    ruang_nested.append(r)
        return ruang_nested
    if name == "laboratorium":
        for r in ruangan:
            for d in data.laboratorium:
                if r.name == d.ruang_laboratorium:
                    ruang_nested.append(r)
        return ruang_nested
    if name == "kepsek_guru":
        for r in ruangan:
            for d in data.kepsek_guru:
                if r.name == d.ruang_kepsekguru:
                    ruang_nested.append(r)
        return ruang_nested
    if name == "kamar_mandi":
        for r in ruangan:
            for d in data.kamar_mandi:
                if r.name == d.kamar_mandiwc:
                    ruang_nested.append(r)
        return ruang_nested
    if name == "perpustakaan":
        for r in ruangan:
            for d in data.perpustakaan:
                if r.name == d.ruang_perpustakaan:
                    ruang_nested.append(r)
        return ruang_nested
    if name == "penunjang":
        for r in ruangan:
            for d in data.penunjang:
                if r.name == d.ruang_penunjang:
                    ruang_nested.append(r)
        return ruang_nested


@frappe.whitelist()
def ruang():
    data = frappe.get_doc('Ruang')
    data.kelas = ruang_detail("kelas")
    data.laboratorium = ruang_detail("laboratorium")
    data.kepsek_guru= ruang_detail("kepsek_guru")
    data.kamar_mandi= ruang_detail("kamar_mandi")
    data.perpustakaan= ruang_detail("perpustakaan")
    data.penunjang= ruang_detail("penunjang")

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
- [done] get "Data Ruang" 
- [done] insert "Data Ruang" sesuai tipe/jenis prasarana pada tab "Ruang"
- [done] validasi jika sudah ada maka update (barang kali ada yang di hapus)
"""
@frappe.whitelist()
def sinkron_ruang():
    data_ruang = get_all_detail("Data Ruang")
    
    ruang =  frappe.get_doc("Ruang")


    ruang.kelas = []
    ruang.kamar_mandi= []
    ruang.kepsek_guru= []
    ruang.laboratorium= []
    ruang.penunjang= []
    ruang.perpustakaan= []
    for a in data_ruang:
        if a.jenis_prasarana == "Ruang Teori/Kelas":
            ruang.append('kelas', {
                'ruang_kelas': a.name,
            })
        if a.jenis_prasarana == "Kamar Mandi/WC":
            ruang.append('kamar_mandi', {
                'kamar_mandiwc': a.name,
            })
        if a.jenis_prasarana == "Ruang Kepsek/Guru":
            ruang.append('kepsek_guru', {
                'ruang_kepsekguru': a.name,
            })
        if a.jenis_prasarana == "Ruang Laboratorium":
            ruang.append('laboratorium', {
                'ruang_laboratorium': a.name,
            })
        if a.jenis_prasarana == "Ruang Penunjang":
            ruang.append('penunjang', {
                'ruang_penunjang': a.name,
            })
        if a.jenis_prasarana == "Ruang Perpustakaan":
            ruang.append('perpustakaan', {
                'ruang_perpustakaan': a.name,
            })

    ruang.save()