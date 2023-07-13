import { I_DisplayMode } from "./file.model";

export interface I_User {
    id: string;
    lastname: string;
    firstname: string;
    email: string;
    password?: string;
    display_mode_id?: string;
    display_mode?: I_DisplayMode | null;
}