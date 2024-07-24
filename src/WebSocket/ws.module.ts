import { Module } from "@nestjs/common";
import { WSService } from "./ws.service";
import { WSController } from "./ws.controller";

@Module({
  controllers: [WSController],
  providers: [WSService],
  exports: [WSService],
})
export class WSModule { }
