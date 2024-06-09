export type TPayloadOaAuthStrava = {
    client_id: string;
    client_secret: string;
    code: string;
    grant_type: string;
};

export type TPayloadOaAuthStravaResponse = {
    token_type: string;
    expires_at: number;
    expires_in: number;
    refresh_token: string;
    access_token: string;
    athlete: any;
    errors?: any[];
};
