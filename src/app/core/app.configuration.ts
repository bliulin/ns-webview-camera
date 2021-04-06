export interface AppConfiguration {
    baseUrl: string; // Base URL for HTTP requests to the API
    authenticationBaseUrl: string; // Base URL of the Authentication Server
    omroProtocol: string; // Custom protocol for opening the OMRO mobile app
    clientID: string; // Client ID sent to the OAuth server
    independentKYCBaseUrl: string;
    gdprPageUrl: string;
    privacyPolicyPageUrl: string;
    applicationInsightsUrl: string;
    instrumentationKey: string;
}
