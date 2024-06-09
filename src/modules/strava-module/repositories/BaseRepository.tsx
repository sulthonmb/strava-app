import PreconditionRequiredException from "../exceptions/PreconditionRequiredException";
import {isTrue} from "../helpers/Boolean";

export default class BaseRepository {

    public model: any;
    public DB_PROVIDERS_SEQUELIZE = 'sequelize';
    public DB_PROVIDERS_MONGODB = 'mongoose';
    private dbProviders = [this.DB_PROVIDERS_SEQUELIZE, this.DB_PROVIDERS_MONGODB]

    protected defaultProperty = ['_id', 'id', 'uuid', 'status', 'created_at', 'updated_at', 'createdAt', 'updatedAt']

    constructor(opts: { model: any }) {
        this.model = opts.model;
    }

    async fields(model: any, extraFields?: string[], additionalFields?: string[], activeUser?: any, flat?: boolean, payload?: any) {
        if (!model) throw new PreconditionRequiredException("Please define models to parsed");

        let responseModel = model?._doc
            ? model.toObject()
            : (model?.dataValues ? model.get({ plain: true}) : model);

        for (const property of Object.keys(responseModel)) {
            if (this.defaultProperty.includes(property)) continue;
            if (!(extraFields || []).includes(property)) delete responseModel[property];
        }

        responseModel.additionalFields = await this.additionalFields(responseModel, additionalFields, activeUser, payload);

        responseModel = isTrue(flat) ? this.flatFields({model: responseModel}) : responseModel;

        return responseModel;
    }

    async additionalFields(responseModel: any, additionalFields?: string[], activeUser?: any, payload?: any) {
        return {};
    }

    flatFields(model: any, prePropertyName = '') {
        let fields = {};
        if ([null, undefined].includes(model)) return fields;

        Object.keys(model).map(property => {
            if (['_id', '__v'].includes(property)) return true;

            if (Array.isArray(model[property])) {
                let index = 0;
                for (const arr of model[property]) {
                    fields = Object.assign(
                        {},
                        fields,
                        this.flatFields(arr, `${prePropertyName}${property}.${index}.`)
                    );
                    index++;
                }
            } else if (model[property] instanceof Date) {
                // @ts-ignore
                fields[prePropertyName + property] = model[property].toGMTString();
            } else if (typeof model[property] === 'object') {
                fields = Object.assign(
                    {},
                    fields,
                    this.flatFields(model[property], `${prePropertyName}${property}.`)
                );
            } else {
                // @ts-ignore
                fields[prePropertyName + property] = model[property];
            }
        })

        return fields;
    }

    async findAndCountAll(options?: any): Promise<{ count: number, rows?: any }> {
        if (!this.dbProviders.includes(this.model.dbProvider)) throw new PreconditionRequiredException("Database provider not supported")

        if (this.model.dbProvider === this.DB_PROVIDERS_SEQUELIZE) {
            // @ts-ignore
            return await this.model.findAndCountAll(options)
        } else if (this.model.dbProvider === this.DB_PROVIDERS_MONGODB) {
            return {
                count: await this.model.count(options?.where),
                rows: await this.model.findAll(options?.where, options?.sort, options?.offset, options?.limit)
            }
        }

        return { count: 0, rows: [] }
    }

    async findAll(options?: any): Promise<any> {
        if (!this.dbProviders.includes(this.model.dbProvider)) throw new PreconditionRequiredException("Database provider not supported")

        if (this.model.dbProvider === this.DB_PROVIDERS_SEQUELIZE) {
            return await this.model.findAll(options)
        } else if (this.model.dbProvider === this.DB_PROVIDERS_MONGODB) {
            return await this.model.findAll(options?.where, options?.sort, options?.offset, options?.limit)
        }

        return null
    }

    async findOne(options?: any): Promise<any> {
        if (!this.dbProviders.includes(this.model.dbProvider)) throw new PreconditionRequiredException("Database provider not supported")

        if (this.model.dbProvider === this.DB_PROVIDERS_SEQUELIZE) {
            return await this.model.findOne(options)
        } else if (this.model.dbProvider === this.DB_PROVIDERS_MONGODB) {
            return await this.model.findOne(options?.where, options?.sort)
        }

        return null
    }

    async count(options?: any): Promise<number> {
        if (!this.dbProviders.includes(this.model.dbProvider)) throw new PreconditionRequiredException("Database provider not supported")

        if (this.model.dbProvider === this.DB_PROVIDERS_SEQUELIZE) {
            return await this.model.count(options)
        } else if (this.model.dbProvider === this.DB_PROVIDERS_MONGODB) {
            return await this.model.count(options?.where)
        }

        return 0
    }
}
