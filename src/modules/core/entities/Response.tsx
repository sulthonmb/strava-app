import ExpectationFailedException from "../exceptions/ExpectationFailedException";
import BadParameterException from "../exceptions/BadParameterException";
import DuplicateEntityException from "../exceptions/DuplicateEntityException";
import ForbiddenException from "../exceptions/ForbiddenException";
import NotAuthorizedException from "../exceptions/NotAuthorizedException";
import NotFoundException from "../exceptions/NotFoundException";
import PreconditionRequiredException from "../exceptions/PreconditionRequiredException";
import {isTrue} from "../helpers/Boolean";

type ResponseConstructor = {
    success?: boolean,
    code?: number,
    message?: string,
    data?: any
}

export default class Response {
    public success: boolean | null | undefined;
    public code: number | null | undefined;
    public message: string | null | undefined;
    public data: any;
    public ts: Date;
    public error: any;

    constructor(opts?: ResponseConstructor) {
        this.success = opts?.success;
        this.code = opts?.code;
        this.message = opts?.message;
        this.data = opts?.data;
        this.ts = new Date();
    }

    defaultResponse(data: any) {
        return data;
    }

    successResponse(message: string, data: any, code?: number) {
        this.success = true;
        this.code = code || 200;
        this.message = message;
        this.data = data;
        this.ts = new Date();

        return this;
    }

    errorResponse(message: string, data: any, code?: number, e?: any) {
        this.success = false;
        this.code = code || 400;
        this.message = message;
        this.data = e?.data ? e.data : data;
        this.ts = new Date();
        this.error = e;

        if (e instanceof BadParameterException) {
            this.message = e?.message;
            this.code = e?.code;
        } if (e instanceof DuplicateEntityException) {
            this.message = e?.message;
            this.code = e?.code;
        } if (e instanceof ExpectationFailedException) {
            this.message = e?.message;
            this.code = e?.code;
        } if (e instanceof ForbiddenException) {
            this.message = e?.message;
            this.code = e?.code;
        } if (e instanceof NotAuthorizedException) {
            this.message = e?.message;
            this.code = e?.code;
        } if (e instanceof NotFoundException) {
            this.message = e?.message;
            this.code = e?.code;
        } if (e instanceof PreconditionRequiredException) {
            this.message = e?.message;
            this.code = e?.code;
        }

        if (isTrue(process.env?.APP_DEBUG)) {
            console.log(e, data);
        }

        return this;
    }
}
