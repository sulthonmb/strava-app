import crypto from "crypto";

export function encryptString(method: string, plaintext: string, secretKey: string): string {
    try {
        const cipher = crypto.createCipher(method, secretKey);
        let encrypted = cipher.update(plaintext, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    } catch (e) {
        return plaintext;
    }
}

export function decryptString(method: string, encrypted: string, secretKey: string) {
    let decrypted = null;
    try {
        const decipher = crypto.createDecipher(method, secretKey);
        decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
    } catch (e) {
        decrypted = encrypted;
    }

    if (decrypted === encrypted) {
        return decrypted;
    }

    return decryptString(method, decrypted, secretKey);
}
