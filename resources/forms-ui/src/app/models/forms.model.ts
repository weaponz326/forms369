export class Forms {
  constructor(
    public form_code?: string,
    public name?: string,
    public merchant_id?: number,
    public form_fields?: any,
    public created_by?: number,
    public updated_by?: number,
    public status?: number,
    public can_view?: number,
    public join_queue?: number,
    public tnc?: number,
    public require_signature?: number,
    public require_payment?: number,
    public currency?: string,
    public amount?: string,
    public created_at?: string,
    public updated_at?: string,
    public deleted_at?: string,
    public deleted_by?: string
  ) {}
}
