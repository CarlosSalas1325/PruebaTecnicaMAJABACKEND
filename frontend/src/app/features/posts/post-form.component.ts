import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CategoriesService, CategoryItem } from "../../core/services/categories.service";
import { PostsService } from "../../core/services/posts.service";

@Component({
  selector: "app-post-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="card">
      <h2>{{ isEdit ? 'Editar' : 'Nuevo' }} post</h2>

      <form [formGroup]="form" (ngSubmit)="submit()" class="form-grid">
        <label>Titulo</label>
        <input type="text" formControlName="title" />

        <label>Contenido</label>
        <textarea rows="8" formControlName="content"></textarea>

        <label>Estado</label>
        <select formControlName="status">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>

        <label>Categorias</label>
        <div class="categories">
          <label *ngFor="let category of categories">
            <input type="checkbox" [checked]="selectedCategoryIds.includes(category.id)" (change)="toggleCategory(category.id, $event)" />
            {{ category.name }}
          </label>
        </div>

        <p class="error" *ngIf="error">{{ error }}</p>
        <button class="primary" type="submit" [disabled]="form.invalid">Guardar</button>
      </form>
    </section>
  `,
  styles: [
    ".form-grid { display: grid; gap: 10px; }",
    ".categories { display: grid; gap: 6px; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }",
    ".error { color: #c92a2a; }"
  ]
})
export class PostFormComponent implements OnInit {
  isEdit = false;
  postId = "";
  categories: CategoryItem[] = [];
  selectedCategoryIds: string[] = [];
  error = "";

  form = this.fb.group({
    title: ["", [Validators.required, Validators.minLength(5)]],
    content: ["", [Validators.required, Validators.minLength(20)]],
    status: ["draft", [Validators.required]]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly categoriesService: CategoriesService,
    private readonly postsService: PostsService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.categoriesService.list().subscribe((categories) => (this.categories = categories));

    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.isEdit = true;
      this.postId = id;
      this.postsService.getById(id).subscribe((post) => {
        this.form.patchValue({
          title: post.title,
          content: post.content,
          status: post.status
        });
        this.selectedCategoryIds = post.categories.map((c) => c.id);
      });
    }
  }

  toggleCategory(categoryId: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedCategoryIds = [...this.selectedCategoryIds, categoryId];
      return;
    }

    this.selectedCategoryIds = this.selectedCategoryIds.filter((id) => id !== categoryId);
  }

  submit(): void {
    if (this.form.invalid) return;

    const payload = {
      ...this.form.getRawValue(),
      categoryIds: this.selectedCategoryIds
    } as { title: string; content: string; status: string; categoryIds: string[] };

    const action = this.isEdit ? this.postsService.update(this.postId, payload) : this.postsService.create(payload);

    action.subscribe({
      next: (post) => this.router.navigate(["/posts", post.id]),
      error: (err) => {
        this.error = err?.error?.message ?? "No se pudo guardar";
      }
    });
  }
}
