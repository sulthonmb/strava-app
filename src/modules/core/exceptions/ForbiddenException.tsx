export default class ForbiddenException extends Error {
    
    data: any;
    code: number;

    constructor(message: string | undefined, data = null) {
        super(message);
        this.name = "Forbidden";
        this.data = data;
        this.code = 403;
    }
}
