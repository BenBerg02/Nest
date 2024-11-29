import { IsOptional, IsString, MinLength } from "class-validator";

export class messageDto{
    @IsString()
    @IsOptional()
    id: string

    @IsString()
    @MinLength(1)
    message: string
}