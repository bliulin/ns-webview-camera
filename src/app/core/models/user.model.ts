import { UserProfileOutputModel } from './user-profile/userProfileOutputModel';

export class User implements UserProfileOutputModel { 
    
    public userId: string;

    public email: string;

    public displayName: string;

    public firstName: string;

    public lastName: string;

    public isKYCDataAvailable: boolean;

    public isKYCUpdateRequired: boolean;

    public lastLogin: Date;

    public initials: string;
}