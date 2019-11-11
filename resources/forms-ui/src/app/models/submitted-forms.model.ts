import { FormStatus } from '../enums/form-status.enum';

export class SubmittedForms {
    constructor(
        public submission_code: string,
        public form_id: string,
        public client_id: number,
        public status: FormStatus,
        public last_processed: string,
        public processed_by: number
    ) {}
}
