import { Routes } from "@angular/router";
import { authGuard } from "./core/guards/auth.guard";
import { LoginComponent } from "./features/auth/login.component";
import { RegisterComponent } from "./features/auth/register.component";
import { PostListComponent } from "./features/posts/post-list.component";
import { PostFormComponent } from "./features/posts/post-form.component";
import { PostDetailComponent } from "./features/posts/post-detail.component";
import { CategoriesAdminComponent } from "./features/categories/categories-admin.component";

export const routes: Routes = [
  { path: "", component: PostListComponent },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "posts/new", canActivate: [authGuard], component: PostFormComponent },
  { path: "posts/:id", component: PostDetailComponent },
  { path: "posts/:id/edit", canActivate: [authGuard], component: PostFormComponent },
  { path: "categories", canActivate: [authGuard], component: CategoriesAdminComponent },
  { path: "**", redirectTo: "" }
];
