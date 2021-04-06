import { User } from "~/app/phone-registration/models/user";

export interface RegistrationRequest {
    registrationId: string;
}

export interface FinishRegistrationResponse {
    refreshToken: string;
    idToken: string;
}

export type FinishRegistrationRequest = {
    password: string;
} & RegistrationRequest;

export type PhoneValidationRequest = {
    phoneValidationCode: string;
} & RegistrationRequest;

export type PhoneRegistrationRequest = User & RegistrationRequest;
