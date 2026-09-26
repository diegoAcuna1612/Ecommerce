import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '@shared/config/environment';
import { obtenerAccessToken } from '@shared/auth';

export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {
    const esAuthPublico =
        req.url.includes('/auth/v1/token') || req.url.includes('/auth/v1/signup');

    const token = esAuthPublico ? null : obtenerAccessToken();

    const reqConAuth = req.clone({
        setHeaders: {
            apikey: environment.apiKey,
            Authorization: `Bearer ${token ?? environment.apiKey}`,
        },
    });

    return next(reqConAuth);
};
