import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="card auth-card">
      <h2>Crear cuenta</h2>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <label>Nombre</label>
        <input type="text" formControlName="name" />

        <label>Email</label>
        <input type="email" formControlName="email" />

        <label>Contrasena</label>
        <input type="password" formControlName="password" />

        <p class="error" *ngIf="error">{{ error }}</p>
        <button class="primary" type="submit" [disabled]="form.invalid || loading">Crear cuenta</button>
      </form>
      <p>Ya tienes cuenta? <a routerLink="/login">Inicia sesion</a></p>
    </section>
  `,
  styles: [
    ".auth-card { max-width: 420px; margin: 20px auto; display: grid; gap: 12px; }",
    "form { display: grid; gap: 10px; }",
    ".error { color: #c92a2a; }"
  ]
})
export class RegisterComponent {
  loading = false;
  error = "";

  form = this.fb.group({
    name: ["", [Validators.required, Validators.minLength(2)]],
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(6)]]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  submit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = "";

    this.authService.register(this.form.getRawValue() as { name: string; email: string; password: string }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(["/"]);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message ?? "Error de registro";
      }
    });
  }
}
