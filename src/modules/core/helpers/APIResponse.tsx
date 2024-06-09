import ResponseEntity from "../entities/Response";

export default class APIResponse extends Response {

    static defaultResponse(res: ResponseEntity) {
        // @ts-ignore
        return this.json(res, { status: res.code || 200 })
    }

    static fromResponse(res: ResponseEntity) {
        // @ts-ignore
        return this.json({
            success: res.success,
            code: res.code,
            message: res.message,
            data: res.data,
            ts: (new Date()).getTime(),
        }, { status: res.code || 200 })
    }

    static successResponse(message: string, data?: any, code?: number|null) {
        // @ts-ignore
        return this.json({
            success: true,
            code: code || 200,
            message,
            data,
            ts: (new Date()).getTime(),
        }, { status: code || 200 })
    }

    static errorResponse(message: string, data?: any, code?: number|null) {
        // @ts-ignore
        return this.json({
            success: false,
            code: code || 200,
            message,
            data,
            ts: (new Date()).getTime(),
        }, { status: code || 400 })
    }
}
