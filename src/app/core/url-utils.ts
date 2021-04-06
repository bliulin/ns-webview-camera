export function getQueryParam(uri: string, name: string): string {
    const results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(uri);
    if (!results) {
        return null;
    }
    return results[1];
}
