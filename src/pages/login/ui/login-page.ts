import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@entities/auth';

@Component({
    selector: 'app-login-page',
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './login-page.html',
})
export class LoginPage {
    private fb = inject(FormBuilder);
    private auth = inject(AuthService);
    private router = inject(Router);

    loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
    });

    onSubmit() {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        this.auth.login({
            nombre: this.loginForm.value.email!.split('@')[0],
            email: this.loginForm.value.email!,
        });

        this.router.navigate(['/checkout']);
    }
}