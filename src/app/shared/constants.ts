/* tslint:disable:typedef variable-name */
export class Onboarding {
    public static readonly onboardingCompleted: string = 'ONBOARDING_COMPLETED';
}

export class Constants {
    public static readonly MaxPinAtempts = 5;
    public static readonly AppLockTimeoutMilis = 5000;
}

export class AppStatus {
    public static readonly SessionID = 'SESSION_ID';
    public static readonly TaCVersion = 'TAC_VERSION';
    public static readonly TaCContent = 'TAC_CONTENT';
    public static readonly TaCLastUpdate = 'TAC_LAST_UPDATE';
    public static readonly MarketingAccord = 'MARKETING_ACCORD';
    public static readonly DefaultCountryPrefix = 'RO';

    public static readonly RefreshToken = 'REFRESH_TOKEN';
    public static readonly AccessToken = 'ACCESS_TOKEN';
    public static readonly IdToken = 'ID_TOKEN';
}

export class AppEvents {
    public static readonly AppState = 'AppState';
    public static readonly TermsAndConditionsOpened = 'TermsAndConditionsOpened';
    public static readonly TermsAndConditionsClosed = 'TermsAndConditionsClosed';
    public static readonly RegistrationId = 'RegistrationId';
    public static readonly RefreshToken = 'RefreshToken';
    public static readonly Logout = 'Logout';
    public static readonly Login = 'Login';
    public static readonly LoggingOut = "LoggingOut";
    public static readonly LoggedOut = "LoggedOut";
    public static readonly LoggedIn = "LoggedIn";
    public static readonly AppSuspended = 'AppSuspended';
}

export class ProductRequestEvents {
    public static readonly UploadDocumentsFinished = 'UploadDocumentsFinished';
    public static readonly QuestionnaireCompleted = 'QuestionnaireCompleted';
    public static readonly InitiateProductRequestCompleted = 'InitiateProductRequestCompleted';
    public static readonly CheckOfferStatusCompleted = 'CheckOfferStatusCompleted';
    public static readonly ProductRequestCancelled = 'ProductRequestCancelled';
    public static readonly ProductSelectionCompleted = 'ProductSelectionCompleted';
    public static readonly UvpCompleted = 'UvpCompleted';
}

export class Authentication {
    public static readonly PassCodeEnabled: string = 'PASSCODE_ENABLED';
    public static readonly BiometricsEnabled: string = 'BIOMETRICS_ENABLED';
    public static readonly Pin: string = 'PIN';
}

export class AppColors {
    public static readonly Blackish = '#131C4D';
    public static readonly Orange = '#F67100';
    public static readonly Red = '#CB0000';
    public static readonly White = '#FFFFFF';
    public static readonly Green = '#88BC08';
    public static readonly GrayLight = '#F4F4F4';
    public static readonly Gray = '#D6D9E0';
    public static readonly SkyDark = '#54C0EE';
    public static readonly Black = '#000000';
    public static readonly Rose = '#EA0076';
}

export class Profile {
    public static readonly CurrentCustomerId: string = 'CURRENT_CUSTOMER_ID';
}

export class Loans {
    public static readonly CurrentLoanId: string = 'CURRENT_LOAN_ID';
}

export class UploadDocuments {
    public static Input = 'UPLOAD_DOCS_INPUT';
}

export class EWallet {
    public static CurrentCardId: string = 'CURRENT_CARD_ID';
}

export class Accounts {
    public static CurrentAccountId: string = 'CURRENT_ACCOUNT_ID';
}

export class PushNotificationsConstants {
    public static OmroPushRegistrationNumber = 'OmroPushRegistrationNumber';
    public static FirebasePushToken = 'FirebasePushToken';
}
