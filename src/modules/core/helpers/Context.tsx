// @ts-ignore
import { getBearerToken, getHeader } from './Http';
import AuthUseCase from '../../../useCases/AuthUseCase';

export async function buildDefaultContext(req: Request) {
    const context = new Map();
    context.set('request', req);
    context.set('accessToken', getHeader(req, 'X-Access-Token'));
    context.set('token', getBearerToken(req));
    // try {
    //     context.set('user', await new AuthUseCase().verifyToken(context.get('token') as string));
    // } catch (e) {
    //     console.log('buildDefaultContext', e);
    // }

    return context;
}
