import AccountService from "../modules/strava-module/service/AccountService";
import Response from '../modules/core/entities/Response';
import { isTrue } from "../modules/core/helpers/Boolean";

type TActivityUseCasePayload = {
    version: string;
    id: number;
};

type TAccountUseCaseConstruct = {
    verbose: boolean;
    accountService: AccountService;
};

export default class AccountUseCase {
    private verbose: boolean;
    private accountService: AccountService;

    constructor(opts?: TAccountUseCaseConstruct) {
        this.verbose = opts?.verbose || isTrue(process.env.APP_DEBUG);
        this.accountService = opts?.accountService || new AccountService();
    }

    async getById(payload: TActivityUseCasePayload, context: Map<any, any>): Promise<any> {
        const response = new Response();

        try {
            const account = await this.accountService.getAccountById(payload.id);
            if (!account) {
                return response.errorResponse('Account not found', null, 404);
            }

            const resp = response.successResponse('Get Account Success', account, 200)
            return resp;
        } catch (error) {
            this.verbose && console.error('Get Account', error);
            return response.errorResponse('Oops ada kesalahan pada sistem', null, 500, error);
        }
    }

    async getAccounts(payload: any, context: Map<any, any>): Promise<any> {
        const response = new Response();

        try {
            const accounts = await this.accountService.getAccounts();
            const resp = response.successResponse('Get Accounts Success', accounts, 200)
            return resp;
        } catch (error) {
            this.verbose && console.error('Get Accounts', error);
            return response.errorResponse('Oops ada kesalahan pada sistem', null, 500, error);
        }
    }
}