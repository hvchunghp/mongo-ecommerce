import { ApiProperty } from '@nestjs/swagger';
import { EStatus } from '../shop.constant';
import {
    IsBoolean,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    MinLength,
} from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
export class CreateShopDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @Transform(({ value }: TransformFnParams) => value?.trim().toLowerCase())
    email: string;

    @ApiProperty()
    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    password: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @IsEnum(EStatus)
    @Transform(({ value }: TransformFnParams) => value?.trim().toLowerCase())
    status: string;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    verify: boolean;
}
