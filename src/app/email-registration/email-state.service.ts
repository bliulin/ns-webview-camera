import { Injectable } from "@angular/core";

// Service responsible with handling navigation between wizard pages.
@Injectable()
export class EmailRegStateService {
    public userEmail: string;
    public registrationId: string;
}
