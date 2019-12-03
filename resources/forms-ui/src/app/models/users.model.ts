export class Users {
    constructor(
        public firstname?: string,
        public lastname?: string,
        public email?: string,
        public password?: string,
        public username?: string,
        public country?: string,
        public phone?: string,
        public password_confirmation?: string,
        public user_type?: number,
        public usertype?: number,
        public gitadmin?: number,
        public merchant_id?: number,
        public branch_id?: number,
        public status?: number,
        public remember_token?: string,
        public active_token?: string,
        public created_at?: string,
        public updated_at?: string,
        public last_login_at?: string,
        public last_login_ip?: string,
        public email_verified_at?: string,
        public deleted_at?: string,
        public name?: string,
        public id?: number
    ) {}
}
