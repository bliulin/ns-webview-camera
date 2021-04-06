import { enable, disable, isEnabled, categories, setCategories, addCategories, write, isCategorySet, addWriter, clearWriters, messageType } from "tns-core-modules/trace";
import { TimestampConsoleWriter } from "./timestamp-trace-writer";

export function initializeTracing(): void {
    setCategories(categories.Debug);
    // setCategories(categories.concat(
    //     categories.Binding,
    //     categories.Layout,
    //     categories.Style,
    //     categories.ViewHierarchy,
    //     categories.VisualTreeEvents
    // ));
    enable();
    clearWriters();
    addWriter(new TimestampConsoleWriter());
}

export function trace(message: string, category: string = categories.Debug, logLevel: number = messageType.log): void {
    if (!isCategorySet(category)) {
        addCategories(category);
    }
    write(message, category, logLevel);
}

export function traceDebug(message: string): void {
    trace(message);
}

export function traceWarning(message: string): void {
    trace(message, categories.Debug, messageType.warn);
}

export function traceError(error: string | Error): void {
    if (typeof error === "string") {
        trace(error, categories.Error, messageType.error);
    } else {
        trace(error.message, categories.Error, messageType.error);
    }
}
