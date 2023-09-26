import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUser } from '../common.interface';

export const User = createParamDecorator(
    (data: keyof IUser, ctx: ExecutionContext) => {
        const req = ctx.switchToHttp().getRequest();
        const user = req.user;

        return data ? user?.[data] : user;
    },
);
