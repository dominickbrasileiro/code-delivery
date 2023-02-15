import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RoutesGateway } from './routes.gateway';
import { RoutesService } from './routes.service';

@Controller('routes')
export class RoutesController {
  constructor(
    private readonly routesService: RoutesService,
    private readonly routesGateway: RoutesGateway,
  ) {}

  @Get()
  findAll() {
    return this.routesService.findAll();
  }

  @MessagePattern('route.new-position')
  consumeNewPosition(
    @Payload()
    message: {
      routeId: string;
      clientId: string;
      position: [number, number];
      finished: boolean;
    },
  ) {
    return this.routesGateway.sendPosition(message);
  }
}
