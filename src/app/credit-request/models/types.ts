export type OfferState =
    | "InProgress"
    | "NeedsManualApproval"
    | "Rejected"
    | "Finished";

export enum ProductType {
    Filbo = "Filbo"
}

export type AlertType = "Informational" | "Warning" | "Success" | "Error";

export type GenericMainAction = 'NoAction' | 'UserKYC' | 'FileRepository' | 'UserApproval';
