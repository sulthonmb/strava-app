import BaseODMModel from '../BaseODMModel';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';

export default class ActivitiesModel extends BaseODMModel {
    constructor(opts?: { dsn?: string }) {
        super({
            ...opts,
            dsn: opts?.dsn || process.env.STRAVA_MONGODB_DSN!,
        });
    }

    modelName(): string {
        return 'activities';
    }

    modelAttributes() {
        return {
            uuid: {
                type: String,
                index: true,
                required: true,
                default: uuidv4(),
            },
            account_id: {
                type: Number,
                index: true,
                required: true,
            },
            activity: {
                id: {
                    type: Number,
                    index: true,
                },
                resource_state: { type: Number },
                external_id: { type: String },
                upload_id: { type: Number },
                athlete: {
                    id: { type: Number },
                    resource_state: { type: Number },
                },
                name: { type: String },
                distance: { type: Number },
                moving_time: { type: Number },
                elapsed_time: { type: Number },
                total_elevation_gain: { type: Number },
                type: { type: String },
                sport_type: { type: String },
                start_date: { type: Date },
                start_date_local: { type: Date },
                timezone: { type: String },
                utc_offset: { type: Number },
                start_latlng: [{ type: Number }],
                end_latlng: [{ type: Number }],
                achievement_count: { type: Number },
                kudos_count: { type: Number },
                comment_count: { type: Number },
                athlete_count: { type: Number },
                photo_count: { type: Number },
                map: {
                    id: { type: String },
                    polyline: { type: String },
                    summary_polyline: { type: String },
                    resource_state: { type: Number },
                },
                trainer: { type: Boolean },
                commute: { type: Boolean },
                manual: { type: Boolean },
                private: { type: Boolean },
                flagged: { type: Boolean },
                gear_id: { type: String },
                from_accepted_tag: { type: Boolean },
                average_speed: { type: Number },
                max_speed: { type: Number },
                average_cadence: { type: Number },
                average_temp: { type: Number },
                average_watts: { type: Number },
                weighted_average_watts: { type: Number },
                kilojoules: { type: Number },
                device_watts: { type: Boolean },
                has_heartrate: { type: Boolean },
                max_heartrate: { type: Number },
                elev_high: { type: Number },
                elev_low: { type: Number },
                pr_count: { type: Number },
                total_photo_count: { type: Number },
                has_kudoed: { type: Boolean },
                workout_type: { type: Number },
                suffer_score: { type: Number },
                description: { type: String },
                calories: { type: Number },
                segment_efforts: [
                    {
                        id: { type: Number },
                        resource_state: { type: Number },
                        name: { type: String },
                        activity: { type: { id: Number, resource_state: Number } },
                        athlete: { type: { id: Number, resource_state: Number } },
                        elapsed_time: { type: Number },
                        moving_time: { type: Number },
                        start_date: { type: Date },
                        start_date_local: { type: Date },
                        distance: { type: Number },
                        start_index: { type: Number },
                        end_index: { type: Number },
                        average_cadence: { type: Number },
                        average_watts: { type: Number },
                        device_watts: { type: Boolean },
                        segment: {
                            id: { type: Number },
                            name: { type: String },
                            activity_type: { type: String },
                            distance: { type: Number },
                            average_grade: { type: Number },
                            maximum_grade: { type: Number },
                            elevation_high: { type: Number },
                            elevation_low: { type: Number },
                            start_latlng: [{ type: Number }],
                            end_latlng: [{ type: Number }],
                            climb_category: { type: Number },
                            city: { type: String },
                            state: { type: String },
                            country: { type: String },
                            private: { type: Boolean },
                            hazardous: { type: Boolean },
                            starred: { type: Boolean },
                        },
                        kom_rank: { type: Number },
                        pr_rank: { type: Number },
                        hidden: { type: Boolean },
                    }
                ],
                splits_metric: [
                    {
                        distance: { type: Number },
                        elapsed_time: { type: Number },
                        elevation_difference: { type: Number },
                        moving_time: { type: Number },
                        split: { type: Number },
                        average_speed: { type: Number },
                        pace_zone: { type: Number },
                    }
                ],
                laps: [
                    {
                        id: { type: Number },
                        resource_state: { type: Number },
                        name: { type: String },
                        activity: { type: { id: Number, resource_state: Number } },
                        athlete: { type: { id: Number, resource_state: Number } },
                        elapsed_time: { type: Number },
                        moving_time: { type: Number },
                        start_date: { type: Date },
                        start_date_local: { type: Date },
                        distance: { type: Number },
                        start_index: { type: Number },
                        end_index: { type: Number },
                        total_elevation_gain: { type: Number },
                        average_speed: { type: Number },
                        max_speed: { type: Number },
                        average_cadence: { type: Number },
                        average_watts: { type: Number },
                        device_watts: { type: Boolean },
                        has_heartrate: { type: Boolean },
                        average_heartrate: { type: Number },
                        max_heartrate: { type: Number },
                        lap_index: { type: Number },
                        split: { type: Number },
                    }
                ],
                gear: {
                    id: { type: String },
                    primary: { type: Boolean },
                    name: { type: String },
                    distance: { type: Number },
                },
                partner_brand_tag: { type: String },
                photos: {
                    primary: {
                        id: { type: String },
                        source: { type: Number },
                        unique_id: { type: String },
                        urls: {
                            '0': { type: String },
                            '100': { type: String },
                            '600': { type: String },
                        },
                    },
                    use_primary_photo: { type: Boolean },
                    count: { type: Number },
                },
                highlighted_kudosers: [
                    {
                        destination_url: { type: String },
                        display_name: { type: String },
                        avatar_url: { type: String },
                        show_name: { type: Boolean },
                    }
                ],
                hide_from_home: { type: Boolean },
                device_name: { type: String },
                embed_token: { type: String },
                segment_leaderboard_opt_out: { type: Boolean },
                leaderboard_opt_out: { type: Boolean },
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        };
    }
}
