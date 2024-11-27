import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const getRawHeaders = createParamDecorator(
    (data, ctx: ExecutionContext) => {
        const { rawHeaders, user } = ctx.switchToHttp().getRequest()

        if(!user)
            throw new InternalServerErrorException('user not found')

        return rawHeaders
    }
)