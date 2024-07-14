function map(frm){
    console.log("halo")
    let mapdata = JSON.parse(frm.doc.map).features[0];
    if(mapdata){
        frm.set_value("lintang", mapdata.geometry.coordinates[0]);
        frm.set_value("bujur", mapdata.geometry.coordinates[1]);
    }
}

function breadcrumbs(frm, doc_route, field){
    frappe.breadcrumbs.clear();
    
    frappe.breadcrumbs.set_custom_breadcrumbs({
        label: "Akademik", 
        route: '/app/akademik',
    });
    frappe.breadcrumbs.set_custom_breadcrumbs({
        label: frm.doctype,
        route: `/app/${doc_route}/view/list`,
    });               
    if(field){
        frappe.breadcrumbs.set_custom_breadcrumbs({
            label: field,
        });               
    } else {
        frappe.breadcrumbs.set_custom_breadcrumbs({
            label: `Buat ${frm.doctype}`,
        });               
    }
}
