
export type StageState = 'Finished' | 'InProgress' | 'NotStarted';
export interface Stage{
    title: string;
    state: StageState;
    requiresUserInput?: boolean;
    details?:string;
}
