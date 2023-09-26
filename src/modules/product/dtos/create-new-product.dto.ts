import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';
import { EProductType } from '../product.constant';

export class ProductAttributeDto {
    @ApiProperty()
    @IsOptional()
    brand: string;

    @ApiProperty()
    @IsOptional()
    manufacture: string;

    @ApiProperty()
    @IsNotEmpty()
    size: string;

    @ApiProperty()
    @IsNotEmpty()
    material: string;
}

export class CreateNewProductDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value.trim())
    product_name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value.trim())
    product_thumb: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @Transform(({ value }: TransformFnParams) => value.trim())
    product_description: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    product_price: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    product_quantity: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsEnum(EProductType)
    @Transform(({ value }: TransformFnParams) => value.trim().toLowerCase())
    product_type: string;

    @ApiProperty()
    @IsNotEmpty()
    product_attributes: ProductAttributeDto;
}
