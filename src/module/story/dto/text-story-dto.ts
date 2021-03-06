import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class TextStoryDto {
  @MaxLength(100)
  @MinLength(1)
  text: string;


  color: string;


  @IsNotEmpty()
  font: string;

  bg: string;

  // @MaxLength(3)
  // @IsNotEmpty()
  // @MinLength(1)
  // coordinatesX: string;

  // @MaxLength(3)
  // @IsNotEmpty()
  // @MinLength(1)
  // coordinatesY: string;
}
