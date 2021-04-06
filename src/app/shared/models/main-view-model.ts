export class MainViewModel {
    protected constructor() {}
    
    public static createViewModel(): MainViewModel {
        return new MainViewModel();
    }

    public get counter(): number {
        return 42;
    }

    public get message(): string {
        return '42 taps offset';
    }
}
