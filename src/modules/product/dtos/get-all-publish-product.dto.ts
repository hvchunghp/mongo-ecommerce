import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsMongoId,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';

export class GetAllPublishProductDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    shopId: string;

    @ApiProperty({
        required: false,
    })
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    page?: number;

    @ApiProperty({
        required: false,
    })
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    limit?: number;

    @ApiProperty({
        required: false,
    })
    @IsString()
    @IsOptional()
    keyword: string;
}
