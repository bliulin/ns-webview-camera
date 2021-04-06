export class ModalInfo {
    public title: string;
    public version: number;
    public content: string;
    public lastUpdate: string;

    constructor(title: string, version: number, content: string, lastUpdate: string) {
        this.title = title;
        this.version = version;
        this.content = content;
        this.lastUpdate = lastUpdate;
    }
}
