import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@shared/auth';
import { passwordsIguales } from '@shared/forms';

@Component({
    selector: 'app-registro-page',
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './registro-page.html',
})
export class RegistroPage {
    private fb = inject(FormBuilder);
    auth = inject(AuthService);
    private router = inject(Router);

    registroForm = this.fb.group(
        {
            nombre: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmarPassword: ['', Validators.required],
        },
        { validators: passwordsIguales() }
    );

    onSubmit() {
        if (this.registroForm.invalid) {
            this.registroForm.markAllAsTouched();
            return;
        }

        const { nombre, email, password } = this.registroForm.getRawValue();

        this.auth.registro(nombre!, email!, password!).subscribe({
            next: () => this.router.navigate(['/']),
            error: () => undefined, // el mensaje se muestra desde auth.error()
        });
    }
}
