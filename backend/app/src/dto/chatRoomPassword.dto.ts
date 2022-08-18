import { ApiProperty } from '@nestjs/swagger'
import { RoomPasswordCommand } from 'chat/roomPasswordCommand.enum'
import { IsEnum, IsNumber, IsString, ValidateIf } from 'class-validator'

export class ChatPasswordDto {
  @ApiProperty({
    description: '대상 채팅방 id',
    examples: [1],
  })
  @IsNumber()
  roomId: number

  @ApiProperty({
    description: '추가/변경/삭제',
    enum: RoomPasswordCommand,
  })
  @IsEnum(RoomPasswordCommand)
  command: RoomPasswordCommand

  @ApiProperty({ description: 'bcrypted string', required: false })
  @IsString()
  @ValidateIf((o) => o.command !== RoomPasswordCommand.ADD)
  password?: string

  @ApiProperty({ description: 'bcrypted string', required: false })
  @IsString()
  @ValidateIf((o) => o.command !== RoomPasswordCommand.DELETE)
  newPassword?: string
}
