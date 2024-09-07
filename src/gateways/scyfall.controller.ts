import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ScyfallGateway } from './scyfall.gateway';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Scyfall')
@Controller('scyfall')
export class ScyfallController {
  constructor(private readonly scyfallGateway: ScyfallGateway) {}

  @Get('seed')
  async seed() {
    await this.scyfallGateway.getLeader();
  }
}
