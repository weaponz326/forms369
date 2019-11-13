export class Merchants {
    constructor(
        public merchant_name: string,
        public country: string,
        public small_logo: string,
        public super_id: number,
        public created_by: string,
        public created_at: string,
        public admin_id?: number,
        public updated_at?: string,
        public status?: number,
        public logo?: string,
        public id?: number
    ) {}
}