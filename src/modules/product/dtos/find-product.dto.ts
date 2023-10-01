import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class FindProductDto {
    @ApiProperty()
    @IsMongoId()
    @IsNotEmpty()
    productId: string;
}
