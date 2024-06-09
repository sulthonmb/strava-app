export function isTrue(val: any) {
    return [1, '1', true, 'true', 'True', 'TRUE'].includes(val);
}

export function isEmpty(val: any) {
    return [null, undefined, {}, []].includes(val);
}
