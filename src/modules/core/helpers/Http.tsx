export function getHeader(req: Request, key: string) {
    const requestHeaders = new Headers(req.headers)
    return requestHeaders.get(key);
}

export function getBearerToken(req: Request): string | boolean {
    const header = getHeader(req, 'Authorization');
    const splitValue = (header || '').split(' ');

    return Array.isArray(splitValue) && splitValue.length > 1 ? splitValue[1] : false
}

export function getQueryParams(req: Request) {
    // @ts-ignore
    const query = req?.nextUrl?.search ? req.nextUrl.search.substring(1) : '';

    const re = /([^&=]+)=?([^&]*)/g;
    const decodeRE = /\+/g;

    const decode = function (str: string) {
        return decodeURIComponent(str.replace(decodeRE, " "));
    };

    let params: { [key:string]: any } = {}, e;
    while (e = re.exec(query)) {
        let k = decode(e[1]), v = decode(e[2]);
        if (k.substring(k.length - 2) === '[]') {
            k = k.substring(0, k.length - 2);
            (params[k] || (params[k] = [])).push(v);
        }
        else params[k] = v;
    }

    const assign = function (obj: { [key:string]: any}, keyPath: any[], value: any) {
        const lastKeyIndex = keyPath.length - 1;
        for (let i = 0; i < lastKeyIndex; ++i) {
            const key = keyPath[i];
            if (!(key in obj))
                obj[key] = {}
            obj = obj[key];
        }
        obj[keyPath[lastKeyIndex]] = value;
    }

    for (let prop in params) {
        const structure = prop.split('[');
        if (structure.length > 1) {
            const levels: any[] = [];
            structure.forEach(function (item, i) {
                const key = item.replace(/[?[\]\\ ]/g, '');
                levels.push(key);
            });
            assign(params, levels, params[prop]);
            delete(params[prop]);
        }
    }
    return params;
}
