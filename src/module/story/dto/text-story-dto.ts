import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class TextStoryDto {
  @MaxLength(100)
  @MinLength(1)
  @IsNotEmpty()
  text: string;

  @MaxLength(20)
  @IsNotEmpty()
  @MinLength(1)
  color: string;

  @MaxLength(3)
  @IsNotEmpty()
  @MinLength(1)
  coordinatesX: string;

  @MaxLength(3)
  @IsNotEmpty()
  @MinLength(1)
  coordinatesY: string;
}
