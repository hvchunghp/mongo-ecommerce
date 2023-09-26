import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class FindAllProductDto {
    @ApiProperty({
        required: false,
    })
    @IsString()
    @IsOptional()
    keyword: string;

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
    @IsOptional()
    @IsNumber()
    @IsIn([1, -1])
    @Transform(({ value }) => parseInt(value))
    sortBy: number;
}
