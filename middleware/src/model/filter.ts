import { ApiProperty } from "@nestjs/swagger";

export class Filter {

  @ApiProperty()
  name: string;

  @ApiProperty()
  value: string | number;

  @ApiProperty()
  operator: string;
}