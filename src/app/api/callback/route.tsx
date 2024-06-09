import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';
import APIResponse from '@/modules/core/helpers/APIResponse';
import { buildDefaultContext } from '@/modules/core/helpers/Context';
import CallbackUseCase from '@/useCases/CallbackUseCase';
import { getQueryParams } from '@/modules/core/helpers/Http';

export async function GET(
    req: NextRequest, http: { 
        params: { version: string; }, 
        query: any
    } 
) {
    return APIResponse.defaultResponse(
        await new CallbackUseCase().getCallback(
            {
                ...http.params,
                ...getQueryParams(req)
            },
            await buildDefaultContext(req),
        ),
    );
}


export async function POST(
    req: NextRequest,
    http: { params: { version: string; } },
) {
    return APIResponse.fromResponse(
        await new CallbackUseCase().exec(
            {
                ...http.params,
                ...(await req.json()),
            },
            await buildDefaultContext(req),
        ),
    );
}
