import { Injectable } from "@angular/core";
import { CryptoService } from "./crypto.service";
import { PKCECodes } from "./pkce-codes";

@Injectable()
export class PKCEService {

    private pkceCodes: PKCECodes;

    constructor(private cryptoService: CryptoService) {}

    public generateCodeChallenge(): string {
        this.pkceCodes = this.generateCodes();
        return this.pkceCodes.codeChallenge;
    }

    public readCodeVerifier(): string {
        if (!this.pkceCodes) {
            throw new Error('Read code challenge first!');
        }
        const code = this.pkceCodes.codeVerifier;
        this.pkceCodes = null;
        return code;
    }

    private generateCodes(): PKCECodes {
        return this.cryptoService.generatePKCECodes();
    }
}
