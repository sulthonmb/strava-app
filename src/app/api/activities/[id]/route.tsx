import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';
import APIResponse from '@/modules/core/helpers/APIResponse';
import { buildDefaultContext } from '@/modules/core/helpers/Context';
import ActivitiesUseCase from '@/useCases/ActivitiesUseCase';

export async function GET(req: NextRequest, http: { params: { version: string; id: number } } ) {
    return APIResponse.fromResponse(
        await new ActivitiesUseCase().getById(
            {
                ...http.params,
            },
            await buildDefaultContext(req),
        ),
    );
}

export async function DELETE(req: NextRequest, http: { params: { version: string; id: number } } ) {
    return APIResponse.fromResponse(
        await new ActivitiesUseCase().deleteById(
            {
                ...http.params,
            },
            await buildDefaultContext(req),
        ),
    );
}
