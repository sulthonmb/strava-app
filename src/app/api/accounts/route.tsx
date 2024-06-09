import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';
import APIResponse from '@/modules/core/helpers/APIResponse';
import { buildDefaultContext } from '@/modules/core/helpers/Context';
import AccountUseCase from '@/useCases/AccountUseCase';

export async function GET(req: NextRequest, http: { params: { version: string; } } ) {
    return APIResponse.fromResponse(
        await new AccountUseCase().getAccounts(
            {
                ...http.params,
            },
            await buildDefaultContext(req),
        ),
    );
}
