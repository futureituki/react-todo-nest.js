import { IsString, IsOptional, IsNotEmpty, IsDate } from "class-validator";

export class UpdateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

}