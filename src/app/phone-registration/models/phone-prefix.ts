export interface PhonePrefix {
    prefix: string;
    code: string;
    country: string;
}
export const PREFIXES: PhonePrefix[] = [
    { prefix: "+355", code: "AL", country: "Albania" },
    { prefix: "+43", code: "AT", country: "Austria" },
    { prefix: "+32", code: "BE", country: "Belgium" },
    { prefix: "+359", code: "BG", country: "Bulgaria" },
    { prefix: "+385", code: "HR", country: "Croatia" },
    { prefix: "+357", code: "CY", country: "Cyprus" },
    { prefix: "+420", code: "CZ", country: "CzechRepublic" },
    { prefix: "+45", code: "DK", country: "Denmark" },
    { prefix: "+372", code: "EE", country: "Estonia" },
    { prefix: "+358", code: "FI", country: "Finland" },
    { prefix: "+33", code: "FR", country: "France" },
    { prefix: "+49", code: "DE", country: "Germany" },
    { prefix: "+36 ", code: "HU", country: "Hungary" },
    { prefix: "+354", code: "IS", country: "Iceland" },
    { prefix: "+353", code: "IE", country: "Ireland" },
    { prefix: "+39", code: "IT", country: "Italy" },
    { prefix: "+371", code: "LV", country: "Latvia" },
    { prefix: "+423", code: "LI", country: "Liechtenstein" },
    { prefix: "+370", code: "LT", country: "Lithuania" },
    { prefix: "+352", code: "LU", country: "Luxembourg" },
    { prefix: "+389", code: "MK", country: "Macedonia" },
    { prefix: "+356", code: "MT", country: "Malta" },
    { prefix: "+373", code: "MD", country: "Moldova" },
    { prefix: "+382", code: "ME", country: "Montenegro" },
    { prefix: "+31", code: "NL", country: "Netherlands" },
    { prefix: "+47", code: "NO", country: "Norway" },
    { prefix: "+48", code: "PL", country: "Poland" },
    { prefix: "+351", code: "PT", country: "Portugal" },
    { prefix: "+40", code: "RO", country: "Romania" },
    { prefix: "+381", code: "RS", country: "Serbia" },
    { prefix: "+421", code: "SK", country: "Slovakia" },
    { prefix: "+386", code: "SI", country: "Slovenia" },
    { prefix: "+34", code: "ES", country: "Spain" },
    { prefix: "+46", code: "SE", country: "Sweden" },
    { prefix: "+41", code: "CH", country: "Switzerland" }
];
