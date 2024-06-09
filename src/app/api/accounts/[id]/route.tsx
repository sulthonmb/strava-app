import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';
import APIResponse from '@/modules/core/helpers/APIResponse';
import { buildDefaultContext } from '@/modules/core/helpers/Context';
import AccountUseCase from '@/useCases/AccountUseCase';

export async function GET(req: NextRequest, http: { params: { version: string; id: number } } ) {
    return APIResponse.fromResponse(
        await new AccountUseCase().getById(
            {
                ...http.params,
            },
            await buildDefaultContext(req),
        ),
    );
}
