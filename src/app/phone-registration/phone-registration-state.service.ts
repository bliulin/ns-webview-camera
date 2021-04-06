import { Injectable } from "@angular/core";
import { User } from "~/app/phone-registration/models/user";

@Injectable()
export class PhoneRegistrationStateService {
    public user: User;
    public registrationId: string;
    constructor() {}
}
