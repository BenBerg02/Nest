import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const GetUser = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const { user } = ctx.switchToHttp().getRequest()

        if(!data){
            if(!user)
                throw new InternalServerErrorException('user not found')

            return user
        }

        return user[data]

    }
);