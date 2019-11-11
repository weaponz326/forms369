export class PasswordResets {
    constructor(
        public email: string,
        public token: string,
        public created_at: string
    ) {}
}
