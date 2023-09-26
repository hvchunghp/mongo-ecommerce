import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FindProductDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    productId: string;
}
