import { Address } from "./api";

export interface CreatePhysicalCardModel {
    accountId: string;
    pin: string;
    adress: Address;
    name: string;
}