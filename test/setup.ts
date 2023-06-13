import { TextEncoder } from "util";
import { Log } from "../src";

jest.mock("../src/utils/CryptoUtils");

beforeAll(() => {
    globalThis.fetch = jest.fn();

    const unload = () =>
        setTimeout(() => window.dispatchEvent(new Event("unload")), 200);

    const location = Object.defineProperties(
        {},
        {
            ...Object.getOwnPropertyDescriptors(window.location),
            assign: {
                enumerable: true,
                value: jest.fn(unload),
            },
            replace: {
                enumerable: true,
                value: jest.fn(unload),
            },
        },
    );
    Object.defineProperty(window, "location", {
        enumerable: true,
        get: () => location,
    });

    globalThis.TextEncoder = TextEncoder;
});

beforeEach(() => {
    Log.setLevel(Log.NONE);
    Log.setLogger(console);
});
