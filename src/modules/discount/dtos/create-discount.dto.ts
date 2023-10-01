import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import {
    IsBoolean,
    IsDateString,
    IsEnum,
    IsMongoId,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';
import { EApplyDiscountFor, EDiscountType } from '../discount.constant';

export class CreateDiscountDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    discount_name: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    discount_description: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsEnum(EDiscountType)
    @Transform(({ value }: TransformFnParams) => value?.trim())
    discount_type: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    discount_value: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    discount_code: string;

    @ApiProperty()
    @IsDateString()
    @IsOptional()
    discount_start_date: Date;

    @ApiProperty()
    @IsDateString()
    @IsOptional()
    discount_end_date: Date;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    discount_max_use: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    discount_max_use_per_user: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    discount_min_price: number;

    @ApiProperty()
    @IsMongoId()
    @IsNotEmpty()
    discount_shopId: string;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    discount_active: boolean;

    @ApiProperty()
    @IsEnum(EApplyDiscountFor)
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    discount_apply_to: string;

    @ApiProperty()
    @IsMongoId({
        each: true,
    })
    @IsOptional()
    discount_list_product: string[];
}
