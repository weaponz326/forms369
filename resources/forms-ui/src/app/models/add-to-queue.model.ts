export class AddToQueue {
  constructor(
    public client_mobile: string,
    public branch_ext: string,
    public service_type: string,
    public single_service_id: string,
    public is_multi_services: string,
    public multiple_services: string,
    public join_now: number,
    public join_at_time: string,
    public entry_src: string
  ) {}
}