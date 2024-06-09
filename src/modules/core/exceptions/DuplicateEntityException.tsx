export default class DuplicateEntityException extends Error {

    data: any;
    code: number;

    constructor(message: string | undefined, data = null) {
        super(message);
        this.name = "Duplicate entities";
        this.data = data;
        this.code = 409;
    }
}
