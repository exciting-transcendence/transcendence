import { ApiProperty } from '@nestjs/swagger'
import { RoomPasswordCommand } from 'chat/roomPasswordCommand.enum'
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator'

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

  @ApiProperty({
    description:
      'bcrypted string\n\n추가시: 새 비밀번호\n\n변경,삭제시: 기존 비밀번호',
  })
  @IsString()
  password: string

  @ApiProperty({
    description: 'bcrypted string\n\n변경시: 새 비밀번호',
    required: false,
  })
  @IsString()
  @IsOptional()
  @ValidateIf((o) => o.command === RoomPasswordCommand.MODIFY)
  newPassword?: string
}
