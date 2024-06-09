import BaseRepository from "./BaseRepository";
import AccountsModel from "../models/odm/AccountsModel";

type AccountRepositoriesConstructor = {
    model: AccountsModel;
};

export default class AccountsRepository extends BaseRepository {
    protected defaultProperty = ['_id', 'uuid', 'account', 'created_at'];

    constructor(opts?: AccountRepositoriesConstructor) {
        super({ ...opts, model: opts?.model || new AccountsModel() });
    }

    async createAccount(account: any, accessToken: string) {
        return await this.model.create({ account, "account.accessToken": accessToken });
    }

    async updateAccessTokenAccount(id: number, accessToken: string) {
        return await this.model.findOneAndUpdate({ "account.id": id }, { "account.accessToken": accessToken });
    }

    async getAccountByAccessToken(accessToken: string) {
        return await this.model.findOne({ "account.accessToken": accessToken });
    }

    async getAccountById(id: number) {
        return await this.model.findOne({ "account.id": id });
    }

    async getListAccounts(filter: any = {}, sort: { [key: string]: number } | null | undefined = { _id: 1 }, offset = 0, limit = 20) {
        return await this.model.findAll(filter, sort, offset, limit);
    }

}