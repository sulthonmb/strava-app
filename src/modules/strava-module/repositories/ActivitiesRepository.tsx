import BaseRepository from "./BaseRepository";
import ActivitiesModel from "../models/odm/ActivitiesModel";

type ActivitiesRepositoryConstructor = {
    model: ActivitiesModel;
};

export default class ActivitiesRepository extends BaseRepository {
    protected defaultProperty = ['_id', 'uuid', 'reference', 'updated_at'];

    constructor(opts?: ActivitiesRepositoryConstructor) {
        super({ ...opts, model: opts?.model || new ActivitiesModel() });
    }

    async createActivity(activity: any) {
        return await this.model.create(activity);
    }

    async getListActivitiesByAccountId(filter: any = {}, sort: { [key: string]: number } | null | undefined = { _id: 1 }, offset = 0, limit = 20) {
        return await this.model.findAll({ ...filter }, sort, offset, limit);
    }

    async getActivityById(id: number) {
        return await this.model.findOne({ "activity.id": id });
    }

    async deleteActivityById(id: number) {
        return await this.model.deleteOne({ "activity.id": id });
    }
}