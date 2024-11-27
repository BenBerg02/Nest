import { applyDecorators, UseGuards } from "@nestjs/common";
import { validRoles } from "../interfaces/valid-roles.interface";
import { RoleProtected } from "./role-protected.decorator";
import { AuthGuard } from "@nestjs/passport";
import { RoleGuard } from "../guards/role/role.guard";

export function auth(...args: validRoles[]){
    return applyDecorators(
        RoleProtected(...args),
        UseGuards(AuthGuard(), RoleGuard),
    )
}