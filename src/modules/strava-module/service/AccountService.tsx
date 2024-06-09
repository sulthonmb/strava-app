import AccountsRepository from "../repositories/AccountsRepository";

type AccountServiceConstructor = {
    model?: AccountsRepository;
};

export default class AccountService {
    private model: AccountsRepository;

    constructor(opts?: AccountServiceConstructor) {
        this.model = opts?.model || new AccountsRepository();
    }

    async createAccount(account: any, accessToken: string): Promise<any> {
        return await this.model.createAccount(account, accessToken);
    }

    async updateAccessTokenAccount(id: number, accessToken: string): Promise<any> {
        return await this.model.updateAccessTokenAccount(id, accessToken);
    }

    async getAccountByAccessToken(accessToken: string): Promise<any> {
        return await this.model.getAccountByAccessToken(accessToken);
    }
    
    async getAccountById(id: number): Promise<any> {
        return await this.model.getAccountById(id);   
    }
    
    async getAccounts(): Promise<any> {
        return await this.model.getListAccounts();
    }
};