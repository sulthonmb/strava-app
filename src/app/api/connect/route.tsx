import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';
import APIResponse from '@/modules/core/helpers/APIResponse';
import { buildDefaultContext } from '@/modules/core/helpers/Context';
import AuthUseCase from '@/useCases/AuthUseCase';


export async function POST(req: NextRequest, http: { params: { version: string }, body: { code: string } } ) {
    return APIResponse.fromResponse(
        await new AuthUseCase().exec(
            {
                ...(await req.json()),
                ...http.params,
                ...http.body,
            },
            await buildDefaultContext(req),
        ),
    );
}
