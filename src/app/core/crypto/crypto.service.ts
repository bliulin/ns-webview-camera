import { Injectable } from "@angular/core";
import { PKCECodes } from "./pkce-codes";
import { stringifyBase64, base64URL } from "./base-64-utils";
var SHA256 = require("crypto-js/sha256");

@Injectable()
export class CryptoService {

    public generatePKCECodes(): PKCECodes {
        const verifier = this.generateCodeVerifier();
        const challenge = this.generateCodeChallenge(verifier);
        return {
            codeVerifier: verifier,
            codeChallenge: challenge
        };
    }

    private generateCodeVerifier(): string {
        const verifier = this.generateRandomString(128);        
        return verifier;
    }

    private generateCodeChallenge(codeVerifier: string): string {
        const digestWordArray = SHA256(codeVerifier);
        let digestBase64 = stringifyBase64(digestWordArray);
        digestBase64 = base64URL(digestBase64);
        return digestBase64;
    }

    private generateRandomString(len: number, charSet?: string): string {
        charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomString = '';
        for (let i = 0; i < len; i++) {
            const randomPoz = Math.floor(Math.random() * charSet.length);
            randomString += charSet.substring(randomPoz, randomPoz + 1);
        }
        return randomString;
    }
}