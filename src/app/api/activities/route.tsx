import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';
import APIResponse from '@/modules/core/helpers/APIResponse';
import { buildDefaultContext } from '@/modules/core/helpers/Context';
import ActivitiesUseCase from '@/useCases/ActivitiesUseCase';
import { getQueryParams } from '@/modules/core/helpers/Http';

export async function GET(
    req: NextRequest, http: { 
        params: { version: string; }, 
    } 
) {
    return APIResponse.defaultResponse(
        await new ActivitiesUseCase().getList(
            {
                ...http.params,
                ...getQueryParams(req)
            },
            await buildDefaultContext(req),
        ),
    );
}
