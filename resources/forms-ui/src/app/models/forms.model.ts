export class Forms {
    constructor(
        public form_code?: string,
        public name?: string,
        public merchant_id?: number,
        public form_fields?: any,
        public created_by?: number,
        public updated_by?: number,
        public status?: number,
        public created_at?: string,
        public updated_at?: string,
        public deleted_at?: string,
        public deleted_by?: string
    ) {}
}
