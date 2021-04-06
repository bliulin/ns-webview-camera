import { AppConfiguration } from "./app.configuration";

const CONFIG_PROD: AppConfiguration = {
    baseUrl: 'https://public-api.filbo.ro/api/',

    authenticationBaseUrl: 'https://identity.filbo.ro/',
    omroProtocol: 'omro.filbo.mobile://',
    clientID: 'filbomobile',

    independentKYCBaseUrl: 'https://kyc.filbo.ro/',
    gdprPageUrl: 'https://filbo.ro/prelucrarea-datelor',
    privacyPolicyPageUrl: 'https://filbo.ro/politica-de-confidentialitate',

    applicationInsightsUrl: "https://dc.services.visualstudio.com/v2/track",
    instrumentationKey: "9cf369d9-bb7b-44a8-8969-7dc041fa01d8"
};

const CONFIG_TEST: AppConfiguration = {
    baseUrl: 'https://test-public-api.filbo.ro/api/',

    authenticationBaseUrl: 'https://test-identity.filbo.ro/',
    omroProtocol: 'omro.filbo.mobile://',
    clientID: 'filbomobile',

    independentKYCBaseUrl: 'https://test-kyc.filbo.ro/',
    gdprPageUrl: 'https://test.filbo.ro/prelucrarea-datelor',
    privacyPolicyPageUrl: 'https://test.filbo.ro/politica-de-confidentialitate',

    applicationInsightsUrl: "https://dc.services.visualstudio.com/v2/track",
    instrumentationKey: "9cf369d9-bb7b-44a8-8969-7dc041fa01d8"
};

const CONFIG_LOCAL: AppConfiguration = {
    baseUrl: 'http://10.0.2.2:44393/api/',

    authenticationBaseUrl: 'http://10.0.2.2:5000/',
    omroProtocol: 'omro.filbo.mobile://',
    clientID: 'filbomobile',

    independentKYCBaseUrl: 'http://10.0.2.2:7999/',
    gdprPageUrl: 'http://10.0.2.2:3000/prelucrarea-datelor',
    privacyPolicyPageUrl: 'http://10.0.2.2:3000/politica-de-confidentialitate',

    applicationInsightsUrl: "https://dc.services.visualstudio.com/v2/track",
    instrumentationKey: "9cf369d9-bb7b-44a8-8969-7dc041fa01d8"
};

export const APP_CONFIG = CONFIG_TEST;
