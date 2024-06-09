// @ts-ignore
import dayjs from "dayjs";
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import mongoose, { Schema, Connection, mongo } from "mongoose";
import { isTrue } from "../helpers/Boolean";
import PreconditionRequiredException from "../exceptions/PreconditionRequiredException";
import { decryptString, encryptString } from "../helpers/Encryptions";


type BaseODMModelConstructor = {
  dsn: string,
  debug?: boolean,
  onlyOpenReadyStateConnection?: boolean
  encryptionMethod?: string;
  encryptionKey?: string;
};

export default class BaseODMModel {

    [x: string]: any;

    protected dbProvider: string = 'mongoose';

    private connection: Connection | undefined;
    private dsn: string;
    private debug: boolean;
    private onlyOpenReadyStateConnection: boolean;

    private encryptionMethod: string | null | undefined = null;
    private encryptionKey: string | null | undefined = null;
    public encryptPaths: string[] = []
    public encrypted: boolean = true;

    constructor(opts: BaseODMModelConstructor) {
        this.dsn = opts.dsn;
        this.debug = opts?.debug || isTrue(false);
        this.onlyOpenReadyStateConnection = opts?.onlyOpenReadyStateConnection || isTrue(undefined);

        this.encryptionMethod = opts.encryptionMethod
        this.encryptionKey = opts.encryptionKey
        this.encrypted = !!opts.encryptionMethod && !!opts.encryptionKey;
  }

    async connect() {
        // https://github.com/Automattic/mongoose/blob/master/lib/connectionstate.js
        // if (mongoose.connection.readyState) {
        //     return connection?._connectionString === this.dsn && connection?._closeCalled !== true && connection?._readyStates === 1;
        // } else {
        //     return connection?._connectionString === this.dsn && connection?._closeCalled !== true
        // }
        // const existingConnection = mongoose.connection.readyState;
        // console.log('mongoose.connections', mongoose.conb@ro2nections)
        const existingConnection = mongoose.connections.find((connection) => {
            if (this.onlyOpenReadyStateConnection) {
                // @ts-ignore
                return connection?._connectionString === this.dsn && connection?._closeCalled !== true && connection?._readyStates === 1;
            } else {
                // @ts-ignore
                return connection?._connectionString === this.dsn && connection?._closeCalled !== true
            }
        });

        // @ts-ignore
        if (!existingConnection || existingConnection?._closeCalled === true) {
            this.connection = mongoose.createConnection(this.dsn, {
                bufferCommands: true,
                autoIndex: true,
            })

            mongoose.set('debug', this.debug);

            // you should only see once per request
            // if there is more than one shown on the terminal,
            // then it's indicate wrong implementation
            console.log('Connected to mongodb...')
        } else {
            this.connection = existingConnection;
        }

        return this;
    }

    async close() {
        if (this.connection) {
            await this.connection.close();
        }
    }

    modelName(): string {
        throw new PreconditionRequiredException('You need to implement modelName function');
    }

    modelAttributes(): Object {
        throw new PreconditionRequiredException('You need to implement modelAttributes function');
    }

    modelVirtualAttributes() {
        return null;
    }

    encrypt(v: string) {
        return this.encrypted ? encryptString(this.encryptionMethod!, v, this.encryptionKey!) : v;
    }

    decrypt(v: string) {
        return this.encrypted ? decryptString(this.encryptionMethod!, v, this.encryptionKey!) : v;
    }

    schema() {
        const schemaOptions = {
            strict: false,
            timestamps: {
                createdAt: "created_at",
                updatedAt: "updated_at"
            },
            toObject: { getters: true, setters: true },
            toJSON: { getters: true, setters: true },
            virtuals: null,
        };

        if (![null, false, undefined, {}].includes(this.modelVirtualAttributes())) {
            schemaOptions['virtuals'] = this.modelVirtualAttributes();
        }

        if (this.connection?.models?.[this.modelName()]) {
            return this.connection.models[this.modelName()];
        } else {
          // @ts-ignore
          const schema = new Schema(this.modelAttributes(), schemaOptions)
          // set a setter and getter for encrypt
          if (this.encryptPaths.length > 0) {
              this.encryptPaths.map(item => {
                  schema.path(item).set((v:string) => this.encrypt(v));
                  schema.path(item).get((v:string) => this.decrypt(v));
              })
          }
          // @ts-ignore
          return this.connection.model(this.modelName(), schema);
      }
    }

    async create(params: any) {
        await this.connect();

        const schema = this.schema();
        params.uuid = params?.uuid ?? uuidv4();

        const newData = new schema(params);
        await newData.save();

        return newData;
    }

    async findOne(filter: any, sort: { [key:string]: number } | null | undefined = null) {
        await this.connect();

        // @ts-ignore
        let query = this.schema().findOne(filter);
        if (sort) query = query.sort(sort);

        const model = await query;

        return model;
    }

    async findAll(filter: any = {}, sort: { [key:string]: number } | null | undefined = { _id: 1 }, offset = 0, limit = 20) {
        await this.connect();

        const options = {};
        if (sort) { // @ts-ignore
            options['sort'] = sort;
        }
        if (offset) { // @ts-ignore
            options['skip'] = parseInt(String(offset), 10);
        }
        if (limit) { // @ts-ignore
            options['limit'] = parseInt(String(limit), 10);
        }

        // @ts-ignore
        const models = await this.schema().find(filter, null, options).exec()

        return models;
    }

    async exists(filter: any = {}) {
        await this.connect();

        const models = await this.schema().exists(filter)

        return !!models;
    }

    async count(filter: any = {}) {
        try {
            await this.connect();

            return await this.schema().countDocuments(filter);
        } catch (error) {
            console.error('Error in counting documents:', error);
            return 0;
        }
    }

    async estimatedDocumentCount() {
        await this.connect();

        const models = await this.schema().estimatedDocumentCount()

        return models || 0;
    }

    async aggregate(filter: any = {}) {
        await this.connect();

        // @ts-ignore
        const models = await this.schema().aggregate(filter)

        return models || 0;
    }

    async distinct(property: string) {
        await this.connect();

        // @ts-ignore
        const models = await this.schema().distinct(property)

        return models;
    }

    async findOneAndUpdate(filter: any, params: any = null, operators: any = null) {
        await this.connect();

        const payload = operators ?? {
            $set: params,
        }

        // @ts-ignore
        const updatedModel = await this.schema().findOneAndUpdate(filter, payload, { new: true });

        return updatedModel;
    }

    async updateMany(filter: any, params: any = null, operators: any = null) {
        await this.connect();

        const payload = operators ?? {
            $set: params,
        }

        // @ts-ignore
        const updatedModel = await this.schema().updateMany(filter, payload, { new: true });

        return updatedModel;
    }

    async delete(model: any) {
        model.deletedAt = dayjs();

        return await this.update(model);
    }

    update(model: any) {
        throw new Error("Method not implemented.");
    }

    async deleteOne(filter: any) {
        await this.connect();

        // @ts-ignore
        const deletedModel = await this.schema().deleteOne(filter);

        return deletedModel;
    }

    async fields(model: any, extraFields: string[] = [], additionalFields: string[] = [], activeUser: any = null, flat: boolean = false) {
        if (!model) {
            throw new PreconditionRequiredException("Please define models to parsed");
        }

        let responseModel = model?._doc ? model.toObject() : model;
        // @ts-ignore
        responseModel.additionalFields = await this.additionalFields(responseModel, additionalFields, activeUser);

        responseModel = flat ? this.flatFields({model: responseModel}) : responseModel;

        return responseModel;
    }

    additionalFields(responseModel: any, additionalFields: string[] = [], activeUser: any = null): any {
        throw new Error("Method not implemented.");
    }

    flatFields(model: any, prePropertyName: string = '') {
        let fields = {};
        if ([null, undefined].includes(model)) return fields;

        Object.keys(model).map(property => {
            if (['_id', '__v'].includes(property)) return true;

            if (Array.isArray(model[property])) {
                let index = 0;
                for (const arr of model[property]) {
                    fields = Object.assign({}, fields, this.flatFields({
                        model: arr,
                        prePropertyName: `${prePropertyName}${property}.${index}.`
                    }));
                    index++;
                }
            } else if (model[property] instanceof Date) {
                // @ts-ignore
                fields[prePropertyName + property] = model[property].toGMTString();
            } else if (typeof model[property] === 'object') {
                fields = Object.assign({}, fields, this.flatFields({
                    model: model[property],
                    prePropertyName: `${prePropertyName}${property}.`
                }))
            } else {
                // @ts-ignore
                fields[prePropertyName + property] = model[property];
            }
        })

        return fields;
    }
}
