export class BranchSuperExecutive {
  constructor(
    public name: string,
    public created_by: number,
    public updated_by: number,
    public created_at: string,
    public updated_at: string,
    public deleted_at: string,
    public id?: number
  ) {}
}