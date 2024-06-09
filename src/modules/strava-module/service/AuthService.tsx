import { TPayloadOaAuthStravaResponse } from "../types/StravaType";

type AuthServiceConstructor = {
    baseUrl?: string;
};

export default class AuthService {
    private baseUrl: string;

    constructor(opts?: AuthServiceConstructor) {
        this.baseUrl = opts?.baseUrl || process.env.STRAVA_HOST! || 'https://www.strava.com';
    }

    async getAccessToken(code: string): Promise<TPayloadOaAuthStravaResponse> {
        const url = `${this.baseUrl}/oauth/token?code=${code}&client_id=${process.env.STRAVA_CLIENT_ID}&client_secret=${process.env.STRAVA_CLIENT_SECRET}&grant_type=authorization_code`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return await response.json();
    }

    async deauthorize(accessToken: string): Promise<void> {
        await fetch(`${this.baseUrl}/oauth/deauthorize`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });
    }

    async subscribeWebhook(accessToken: string): Promise<void> {
        await fetch(`${this.baseUrl}/push_subscriptions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                client_id: process.env.STRAVA_CLIENT_ID,
                client_secret: process.env.STRAVA_CLIENT_SECRET,
                callback_url: process.env.STRAVA_CALLBACK_URL,
                verify_token: process.env.STRAVA_VERIFY_TOKEN,
            }),
        });
    }

    async unsubscribeWebhook(id: string): Promise<void> {
        await fetch(`${this.baseUrl}/push_subscriptions/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                client_id: process.env.STRAVA_CLIENT_ID,
                client_secret: process.env.STRAVA_CLIENT_SECRET,
            }),
        });
    }
}