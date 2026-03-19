import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { CategoriesService, CategoryItem } from "../../core/services/categories.service";

@Component({
  selector: "app-categories-admin",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="card">
      <h2>Administrar categorias</h2>

      <form [formGroup]="form" (ngSubmit)="submit()" class="form-grid">
        <label>Nombre</label>
        <input type="text" formControlName="name" />

        <label>Descripcion</label>
        <input type="text" formControlName="description" />

        <button class="primary" type="submit" [disabled]="form.invalid">{{ editingId ? 'Actualizar' : 'Crear' }}</button>
      </form>

      <article class="row" *ngFor="let category of categories">
        <div>
          <strong>{{ category.name }}</strong>
          <p>{{ category.description || 'Sin descripcion' }}</p>
        </div>
        <div class="actions">
          <button (click)="edit(category)">Editar</button>
          <button class="danger" (click)="remove(category.id)">Eliminar</button>
        </div>
      </article>
    </section>
  `,
  styles: [
    ".form-grid { display: grid; gap: 8px; margin-bottom: 14px; }",
    ".row { border-top: 1px solid #d8dee6; padding: 10px 0; display: flex; justify-content: space-between; gap: 8px; }",
    ".actions { display: flex; gap: 8px; align-items: center; }",
    "p { margin: 4px 0; color: #5f6b7a; }"
  ]
})
export class CategoriesAdminComponent implements OnInit {
  categories: CategoryItem[] = [];
  editingId: string | null = null;

  form = this.fb.group({
    name: ["", [Validators.required, Validators.minLength(2)]],
    description: [""]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.categoriesService.list().subscribe((data) => (this.categories = data));
  }

  edit(category: CategoryItem): void {
    this.editingId = category.id;
    this.form.patchValue({ name: category.name, description: category.description ?? "" });
  }

  submit(): void {
    if (this.form.invalid) return;

    const payload = this.form.getRawValue() as { name: string; description?: string };

    const action = this.editingId
      ? this.categoriesService.update(this.editingId, payload)
      : this.categoriesService.create(payload);

    action.subscribe(() => {
      this.editingId = null;
      this.form.reset();
      this.load();
    });
  }

  remove(id: string): void {
    this.categoriesService.delete(id).subscribe(() => this.load());
  }
}
