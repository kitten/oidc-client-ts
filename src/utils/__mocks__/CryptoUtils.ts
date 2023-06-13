/// <reference types="node" />
const { createHash } = jest.requireActual<typeof import("crypto")>("crypto");

const UUID_V4_TEMPLATE = "10000000-1000-4000-8000-100000000000";

const toBase64 = (val: ArrayBuffer): string =>
    btoa([...new Uint8Array(val)]
        .map((chr) => String.fromCharCode(chr))
        .join(""));

/**
 * @internal
 */
export class CryptoUtils {
    /**
     * Generates RFC4122 version 4 guid
     */
    public static generateUUIDv4(): string {
        const uuid = UUID_V4_TEMPLATE.replace(/[018]/g, c =>
            (+c ^ 0 >> +c / 4).toString(16),
        );
        return uuid.replace(/-/g, "");
    }

    /**
     * PKCE: Generate a code verifier
     */
    public static generateCodeVerifier(): string {
        return CryptoUtils.generateUUIDv4() + CryptoUtils.generateUUIDv4() + CryptoUtils.generateUUIDv4();
    }

    /**
     * PKCE: Generate a code challenge
     */
    public static async generateCodeChallenge(code_verifier: string): Promise<string> {
        return createHash("sha256")
            .update(code_verifier, "utf8")
            .digest("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");
    }

    /**
     * Generates a base64-encoded string for a basic auth header
     */
    public static generateBasicAuth(client_id: string, client_secret: string): string {
        const encoder = new TextEncoder();
        const data = encoder.encode([client_id, client_secret].join(":"));
        return toBase64(data);
    }
}
