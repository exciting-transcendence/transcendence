import { ApiProperty } from '@nestjs/swagger'
import { RoomType } from 'chat/roomtype.enum'
import { IsEnum, IsNumber, IsString, ValidateIf } from 'class-validator'

export class ChatRoomDto {
  @ApiProperty({ description: 'CREATE할 때는 자동 생성', required: false })
  @IsNumber()
  roomId: number

  @ApiProperty({ examples: ['test_title'] })
  @IsString()
  roomName: string

  @ApiProperty({ enum: RoomType })
  @IsEnum(RoomType)
  roomType: RoomType

  @ApiProperty({ required: false })
  @IsString()
  @ValidateIf((o) => o.roomType === RoomType.PROTECTED)
  roomPassword: string
}
