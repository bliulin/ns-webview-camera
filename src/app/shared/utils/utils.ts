
export function parseBoolean(value: string): boolean {
    if (!value) {
        return false;
    }
    return value.toLowerCase() === "true";
}

export function isValidColor(color: string): boolean {
    const hexColorRegex = new RegExp(/^#[0-9A-F]{6}$/i);
    return color && hexColorRegex.test(color);
}
