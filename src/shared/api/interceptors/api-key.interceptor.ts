import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '@shared/config/environment';

export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {
    const reqConApiKey = req.clone({
        setHeaders: {
            apikey: environment.apiKey,
            Authorization: `Bearer ${environment.apiKey}`,
        },
    });

    return next(reqConApiKey);
};