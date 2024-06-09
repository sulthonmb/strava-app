import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import APIResponse from '@/modules/core/helpers/APIResponse';
import Response from '@/modules/core/entities/Response';
import { getBearerToken } from '@/modules/core/helpers/Http';

export async function middleware(req: NextRequest) {
    const response = new Response();

    const token = getBearerToken(req) as string;
    
    if (!token) {
        return APIResponse.fromResponse(response.errorResponse('Unauthorized', null, 401));
    }

    if (!process.env.JWT_SECRET || typeof process.env.JWT_SECRET !== 'string') {
        return APIResponse.fromResponse(response.errorResponse('Unauthorized', null, 401));
    }

    if (typeof process.env.JWT_SECRET === 'boolean') {
        return APIResponse.fromResponse(response.errorResponse('Unauthorized', null, 401));
    }

    const verify = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));

    if (!verify) {
        return APIResponse.fromResponse(response.errorResponse('Unauthorized token invalid', null, 401));
    }

    console.log('token', token)
    return NextResponse.next();
}
  
export const config = {
    matcher: ['/api/activities/:path*', '/api/accounts/:path*']
};
