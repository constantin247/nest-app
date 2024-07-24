import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import * as errors from "../errors";
import { WSService } from "./ws.service";

@swagger.ApiTags("webSocketAPI")
@common.Controller("web-socket-apis")
export class WSController {
    constructor(protected readonly service: WSService) { }

    @common.Get("/hello")
    @swagger.ApiOkResponse({
        type: String
    })
    @swagger.ApiNotFoundResponse({
        type: errors.NotFoundException
    })
    @swagger.ApiForbiddenResponse({
        type: errors.ForbiddenException
    })
    async Hello(): Promise<string> {
        return "Hello World!";
    }
}
