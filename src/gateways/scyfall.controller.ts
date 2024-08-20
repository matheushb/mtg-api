import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ScyfallGateway } from './scyfall.gateway';

@ApiTags('Scyfall')
@Controller('scyfall')
export class ScyfallController {
  constructor(private readonly scyfallGateway: ScyfallGateway) {}

  @Get('seed')
  async seed() {
    await this.scyfallGateway.getLeader();
  }
}
