import { Component, inject } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    ReactiveFormsModule,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@entities/auth';

function passwordsIguales(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
        const password = group.get('password')?.value;
        const confirmar = group.get('confirmarPassword')?.value;
        return password === confirmar ? null : { passwordsNoCoinciden: true };
    };
}

@Component({
    selector: 'app-registro-page',
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './registro-page.html',
})
export class RegistroPage {
    private fb = inject(FormBuilder);
    private auth = inject(AuthService);
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

        this.auth.login({
            nombre: this.registroForm.value.nombre!,
            email: this.registroForm.value.email!,
        });

        this.router.navigate(['/']);
    }
}