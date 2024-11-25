import { IsArray, IsIn, IsInt, IsNegative, IsNumber, IsOptional, IsPositive, IsString, MinLength, minLength } from "class-validator"

export class CreateProductDto {
    @IsString()
    @MinLength(1)
    title:string

    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?:number

    @IsString()
    @IsOptional()
    description?: string

    @IsString()
    @IsOptional()
    slug?: string

    @IsInt()
    @IsNegative()
    @IsOptional()
    stock?: number

    @IsString({ each: true })
    @IsArray()
    sizes: string[]

    @IsIn(['men', 'women', 'child', 'unisex'])
    gender: string
}
