import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {
    const reqConApiKey = req.clone({
        setHeaders: {
            apikey: environment.apiKey,
            Authorization: `Bearer ${environment.apiKey}`,
        },
    });

    return next(reqConApiKey);
};