import { SignJWT } from 'jose';
import AccountService from "../modules/strava-module/service/AccountService";
import AuthService from "../modules/strava-module/service/AuthService";
import Response from '../modules/core/entities/Response';
import { isTrue } from "../modules/core/helpers/Boolean";

type TaAuthUseCasePayload = {
    code: string;
};

type TAuthUseCaseConstruct = {
    verbose: boolean;
    authService: AuthService;
    accountService: AccountService;
};

export default class AuthUseCase {
    private verbose: boolean;
    private authService: AuthService;
    private accountService: AccountService;

    constructor(opts?: TAuthUseCaseConstruct) {
        this.verbose = opts?.verbose || isTrue(process.env.APP_DEBUG);
        this.authService = opts?.authService || new AuthService();
        this.accountService = opts?.accountService || new AccountService();
    }

    async exec(payload: TaAuthUseCasePayload, context: Map<any, any>): Promise<any> {
        const response = new Response();

        try {
            const accessTokenStrava = await this.authService.getAccessToken(payload.code);

            if (accessTokenStrava?.errors && accessTokenStrava?.errors?.length > 0) {
                return { error: 'Invalid code' }
            }

            const account = await this.accountService.getAccountById(accessTokenStrava?.athlete?.id);

            if (!account) {
                await this.accountService.createAccount(accessTokenStrava.athlete, accessTokenStrava.access_token);
            }

            if (account && account.accessToken !== accessTokenStrava.access_token) {
                await this.accountService.updateAccessTokenAccount(accessTokenStrava.athlete.id, accessTokenStrava.access_token);
            }

            const iat = Math.floor(Date.now() / 1000);
            const exp = iat + 60* 60; // one hour

            const token = await new SignJWT({...payload})
                .setProtectedHeader({alg: 'HS256', typ: 'JWT'})
                .setExpirationTime(exp)
                .setIssuedAt(iat)
                .setNotBefore(iat)
                .sign(new TextEncoder().encode(process.env.JWT_SECRET));
            
            const resp = response.successResponse('Auth Success', { token, accessToken: accessTokenStrava.access_token, athlete: accessTokenStrava.athlete }, 200)
            return resp;
        } catch (error) {
            this.verbose && console.error('Auth', error);
            return response.errorResponse('Oops ada kesalahan pada sistem', null, 500, error);
        }
    }

    async deauthorize(payload: any, context: Map<any, any>): Promise<any> {
        const response = new Response();

        try {
            const token = context.get('token');
            const accessToken = context.get('accessToken');

            if (!token || !accessToken) {
                return response.errorResponse('Token not found', null, 400);
            }

            await this.authService.deauthorize(accessToken);

            return response.successResponse('Deauthorize Success', null, 200);
        } catch (error) {
            this.verbose && console.error('Deauthorize', error);
            return response.errorResponse('Oops ada kesalahan pada sistem', null, 500, error);
        }
    }
}