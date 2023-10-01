import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import {
    IsEnum,
    IsMongoId,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';
import { EProductType } from '../product.constant';

export class UpdateProductAttributeDto {
    @ApiProperty()
    @IsOptional()
    brand: string;

    @ApiProperty()
    @IsOptional()
    manufacture: string;

    @ApiProperty()
    @IsOptional()
    size: string;

    @ApiProperty()
    @IsOptional()
    material: string;
}

export class UpdateProductDto {
    @ApiProperty()
    @IsMongoId()
    @IsNotEmpty()
    productId: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsEnum(EProductType)
    @Transform(({ value }: TransformFnParams) => value?.trim().toLowerCase())
    product_type: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    product_name: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    product_thumb: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    product_description: string;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    product_price: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    product_quantity: number;

    @ApiProperty()
    @IsOptional()
    product_attributes: UpdateProductAttributeDto;
}
