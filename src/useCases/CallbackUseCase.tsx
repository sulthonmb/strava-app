import ActivitiesService from "../modules/strava-module/service/ActivitiesService";
import AccountService from "@/modules/strava-module/service/AccountService";
import Response from '../modules/core/entities/Response';
import { isTrue } from "../modules/core/helpers/Boolean";

type TActivityUseCasePayload = {
    version: string;
    id: number;
};

type TActivitiesUseCaseConstruct = {
    verbose: boolean;
    activitiesService: ActivitiesService;
    accountService: AccountService;
};

export default class ActivitiesUseCase {
    private verbose: boolean;
    private activitiesService: ActivitiesService;
    private accountService: AccountService;

    constructor(opts?: TActivitiesUseCaseConstruct) {
        this.verbose = opts?.verbose || isTrue(process.env.APP_DEBUG);
        this.activitiesService = opts?.activitiesService || new ActivitiesService();
        this.accountService = opts?.accountService || new AccountService();
    }

    async exec(payload: any, context: Map<any, any>): Promise<any> {
        const response = new Response();

        try {
            const account = await this.accountService.getAccountById(payload.owner_id);

            if (!account) {
                return response.errorResponse('Account not found', null, 404);
            }

            const accessToken = account?.account?.accessToken;
            if (!accessToken) {
                return response.errorResponse('Access Token not found', null, 404);
            }

            if (payload.object_type == "activity" && payload.aspect_type == "create" && payload.object_id) {
                const activity = await this.activitiesService.getActivityById(accessToken, payload.object_id);

                await this.activitiesService.createActivity(payload.owner_id, activity);
            }

            const resp = response.successResponse('Callback Success', {}, 200)
            return resp;
        } catch (error) {
            this.verbose && console.error('Callback', error);
            return response.errorResponse('Oops ada kesalahan pada sistem', null, 500, error);
        }
    }

    async getCallback(payload: any, context: Map<any, any>): Promise<any> {
        const response = new Response();

        try {
            return response.defaultResponse(payload);
        } catch (error) {
            this.verbose && console.error('Get Callback', error);
            return response.errorResponse('Oops ada kesalahan pada sistem', null, 500, error);
        }
    }
}