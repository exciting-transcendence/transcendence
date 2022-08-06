import { IsBoolean, IsNumber, IsString, IsUrl } from 'class-validator'

export class RegisterUserDto {
  @IsNumber()
  uid: number

  @IsBoolean()
  twoFactor: boolean

  @IsString()
  nickname: string

  @IsUrl()
  avata: string
}
