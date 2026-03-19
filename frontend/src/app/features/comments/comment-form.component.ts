import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";

@Component({
  selector: "app-comment-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" class="comment-form">
      <label>{{ label }}</label>
      <textarea rows="3" formControlName="content"></textarea>
      <button class="primary" type="submit" [disabled]="form.invalid">Guardar comentario</button>
    </form>
  `,
  styles: [
    ".comment-form { display: grid; gap: 8px; margin-top: 12px; }"
  ]
})
export class CommentFormComponent {
  @Input() label = "Nuevo comentario";
  @Output() save = new EventEmitter<string>();

  form = this.fb.group({
    content: ["", [Validators.required, Validators.minLength(2)]]
  });

  constructor(private readonly fb: FormBuilder) {}

  submit(): void {
    if (this.form.invalid) return;
    this.save.emit(this.form.getRawValue().content ?? "");
    this.form.reset();
  }
}
