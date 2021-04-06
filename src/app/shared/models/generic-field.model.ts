export interface Field {
    label: string;
    submittedValue?: string;
    defaultValue?: string;
    possibleValues?: { [key: string]: string };
}