export class CompanyBranches {
  constructor(
    public merchant_id: number,
    public branch_name: string,
    public branch_super_id: number,
    public branch_admin_id: number,
    public physical_address?: string,
    public branch_ext?: string,
    public status?: number,
    public created_by?: string,
    public created_at?: string,
    public updated_at?: string,
    public updated_by?: number,
    public id?: number
  ) {}
}