import BaseODMModel from '../BaseODMModel';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';

export default class AccountsModel extends BaseODMModel {
    constructor(opts?: { dsn?: string }) {
        super({
            ...opts,
            dsn: opts?.dsn || process.env.STRAVA_MONGODB_DSN!,
        });
    }

    modelName(): string {
        return 'accounts';
    }

    modelAttributes() {
        return {
            uuid: {
                type: String,
                index: true,
                required: true,
                default: uuidv4(),
            },
            account: {
                id: {
                    type: Number,
                    index: true,
                },
                username: {
                    type: String,
                    index: true,
                },
                resource_state: { type: Number },
                firstname: { type: String },
                lastname: { type: String },
                city: { type: String },
                state: { type: String },
                country: { type: String },
                sex: { type: String },
                premium: { type: Boolean },
                summit: { type: Boolean },
                created_at: { type: Date },
                updated_at: { type: Date },
                badge_type_id: { type: Number },
                profile_medium: { type: String },
                profile: { type: String },
                friend: { type: String },
                follower: { type: String },
                follower_count: { type: Number },
                friend_count: { type: Number },
                mutual_friend_count: { type: Number },
                athlete_type: { type: Number },
                date_preference: { type: String },
                measurement_preference: { type: String },
                clubs: [{ type: Number }],
                ftp: { type: Number },
                weight: { type: Number },
                bikes: [
                    {
                        id: { type: String },
                        primary: { type: Boolean },
                        name: { type: String },
                        resource_state: { type: Number },
                        distance: { type: Number },
                    },
                ],
                shoes: [
                    {
                        id: { type: String },
                        primary: { type: Boolean },
                        name: { type: String },
                        resource_state: { type: Number },
                        distance: { type: Number },
                    },
                ],
                accessToken: { type: String },
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        };
    }
}
