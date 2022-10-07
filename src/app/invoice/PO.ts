export class PO {
    id  !: string;
    external_id  !: string;
    requested_by  !: string;
    datum !: string;
    company !: string;
    company_code !: string;
    short_text !: string;
    po_quantity !: number;
    overall_limit !: number;
    gr_execution_date !: string;
    sbu !: string;
    status !: string;
}