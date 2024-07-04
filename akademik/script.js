export function hide_id(doc) {
    frappe.listview_settings[doc] = {
        hide_name_column: true,
        hide_name_filter: true
    };
}
