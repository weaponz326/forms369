export class CompanyBranches {
    constructor(
        public merchant_id: number,
        public branch_name: string,
        public branch_super_id: number,
        public branch_admin_id: number,
        public created_by?: string,
        public created_at?: string,
        public updated_at?: string,
        public updated_by?: number,
        public status?: number,
        public id?: number
    ) {}
}