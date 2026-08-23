import { HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
export const SUPABASE_CONFIG = {
    baseUrl:environment.apiUrl,
    header : new HttpHeaders({
        'apiKey':environment.apiKey
    })
}