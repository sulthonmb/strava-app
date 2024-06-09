import ActivitiesRepository from "../repositories/ActivitiesRepository";

type ActivitiesServiceConstructor = {
    baseUrl?: string;
    repository?: ActivitiesRepository;
};

export default class ActivitiesService {
    private baseUrl: string;
    private repository: ActivitiesRepository;

    constructor(opts?: ActivitiesServiceConstructor) {
        this.baseUrl = opts?.baseUrl || process.env.STRAVA_HOST! || 'https://www.strava.com/api/v3';
        this.repository = opts?.repository || new ActivitiesRepository();
    }

    async createActivity(accountId: string, activity: any): Promise<any> {
        return await this.repository.createActivity({ account_id: accountId, activity });
    }

    async getActivityAccountById(id: number): Promise<any> {
        return await this.repository.getActivityById(id);
    }

    async getActivitiesAccount(filter: any = {}, sort: { [key: string]: number } | null | undefined = { _id: 1 }, offset = 0, limit = 20): Promise<any> {
        return await this.repository.getListActivitiesByAccountId(filter, sort, offset, limit);
    }

    async getActivities(accessToken: string): Promise<any> {
        const response = await fetch(`${this.baseUrl}/athlete/activities`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return await response.json();
    }

    async getActivityById(accessToken: string, id: string): Promise<any> {
        const response = await fetch(`${this.baseUrl}/activities/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return await response.json();
    }

    async deleteActivity(id: number): Promise<void> {
        await this.repository.deleteActivityById(id);
    }
}