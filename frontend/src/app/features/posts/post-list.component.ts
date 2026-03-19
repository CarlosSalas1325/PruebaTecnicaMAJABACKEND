import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CategoriesService, CategoryItem } from "../../core/services/categories.service";
import { PostItem, PostsService } from "../../core/services/posts.service";
import { AuthService } from "../../core/services/auth.service";

@Component({
  selector: "app-post-list",
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <section class="card">
      <div class="toolbar">
        <h2>Publicaciones</h2>
        <a class="primary-btn" routerLink="/posts/new" *ngIf="authService.isAuthenticated()">Nuevo post</a>
      </div>

      <div class="filters">
        <input [(ngModel)]="filters.search" placeholder="Buscar por titulo o contenido" />
        <select [(ngModel)]="filters.status">
          <option value="">Todos</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <select [(ngModel)]="filters.categoryId">
          <option value="">Todas las categorias</option>
          <option *ngFor="let c of categories" [value]="c.id">{{ c.name }}</option>
        </select>
        <button class="primary" (click)="loadPosts()">Aplicar</button>
      </div>

      <article class="post" *ngFor="let post of posts">
        <h3><a [routerLink]="['/posts', post.id]">{{ post.title }}</a></h3>
        <p>{{ post.content.slice(0, 160) }}...</p>
        <small>
          Autor: {{ post.author.name }} | Estado: {{ post.status }} | Categorias:
          {{ getCategoryNames(post) }}
        </small>
      </article>

      <div class="pagination">
        <button (click)="previousPage()" [disabled]="meta.page <= 1">Anterior</button>
        <span>Pagina {{ meta.page }} / {{ meta.totalPages || 1 }}</span>
        <button (click)="nextPage()" [disabled]="meta.page >= meta.totalPages">Siguiente</button>
      </div>
    </section>
  `,
  styles: [
    ".toolbar { display: flex; justify-content: space-between; align-items: center; }",
    ".primary-btn { background: #0b6bcb; color: #fff; padding: 8px 12px; border-radius: 8px; text-decoration: none; }",
    ".filters { margin: 12px 0; display: grid; gap: 8px; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }",
    ".post { border-top: 1px solid #d8dee6; padding: 12px 0; }",
    ".post h3 { margin: 0 0 8px; }",
    ".pagination { margin-top: 12px; display: flex; justify-content: space-between; align-items: center; }"
  ]
})
export class PostListComponent implements OnInit {
  posts: PostItem[] = [];
  categories: CategoryItem[] = [];
  meta = { page: 1, limit: 10, total: 0, totalPages: 1 };

  filters: Record<string, string | number> = {
    search: "",
    status: "",
    categoryId: "",
    page: 1,
    limit: 10
  };

  constructor(
    private readonly postsService: PostsService,
    private readonly categoriesService: CategoriesService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.categoriesService.list().subscribe((categories) => (this.categories = categories));
    this.loadPosts();
  }

  loadPosts(): void {
    this.postsService.list(this.filters).subscribe((response) => {
      this.posts = response.data;
      this.meta = response.meta;
    });
  }

  previousPage(): void {
    const page = Number(this.filters.page) - 1;
    this.filters.page = Math.max(1, page);
    this.loadPosts();
  }

  nextPage(): void {
    const page = Number(this.filters.page) + 1;
    this.filters.page = Math.min(this.meta.totalPages, page);
    this.loadPosts();
  }

  getCategoryNames(post: PostItem): string {
    const names = post.categories.map((category) => category.name);
    return names.length ? names.join(", ") : "Sin categoria";
  }
}
