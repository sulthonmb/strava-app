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

    async getById(payload: TActivityUseCasePayload, context: Map<any, any>): Promise<any> {
        const response = new Response();

        try {
            const activity = await this.activitiesService.getActivityAccountById(payload.id);
            if (!activity) {
                return response.errorResponse('Activity not found', null, 404);
            }

            const resp = response.successResponse('Get Activity Success', activity, 200)
            return resp;
        } catch (error) {
            this.verbose && console.error('Get Activity', error);
            return response.errorResponse('Oops ada kesalahan pada sistem', null, 500, error);
        }
    }

    async getList(payload: any, context: Map<any, any>): Promise<any> {
        const response = new Response();

        try {
            const perPage = payload.perPage || 20;
            const page = payload.page || 1;
            const offset = (page - 1) * perPage;
            const limit = perPage;
            const sortBy = payload.sortBy || 'created_at';
            const order = payload.order || 'desc';
            const sort = { [sortBy]: order === 'desc' ? -1 : 1 };

            const filterBy = payload.filterBy || 'all';
            const filterValue = payload.filterValue || '';
            const filter = filterBy === 'all' ? {} : { [filterBy]: filterValue };
            
            const activities = await this.activitiesService.getActivitiesAccount(filter, sort, offset, limit);

            const resp = response.successResponse('Get Activities Success', activities, 200)
            return resp;
        } catch (error) {
            this.verbose && console.error('Get Activities', error);
            return response.errorResponse('Oops ada kesalahan pada sistem', null, 500, error);
        }
    }

    async deleteById(payload: TActivityUseCasePayload, context: Map<any, any>): Promise<any> {
        const response = new Response();

        try {
            const activity = await this.activitiesService.getActivityAccountById(payload.id);
            if (!activity) {
                return response.errorResponse('Activity not found', null, 404);
            }

            await this.activitiesService.deleteActivity(payload.id);

            const resp = response.successResponse('Delete Activity Success', null, 200)
            return resp;
        } catch (error) {
            this.verbose && console.error('Delete Activity', error);
            return response.errorResponse('Oops ada kesalahan pada sistem', null, 500, error);
        }
    }
}