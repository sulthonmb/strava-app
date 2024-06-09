export default class NotFoundException extends Error {

    data: any;
    code: number;

    constructor(message: string | undefined, data = null) {
        super(message);
        this.name = "Not found";
        this.data = data;
        this.code = 404;
    }
}
