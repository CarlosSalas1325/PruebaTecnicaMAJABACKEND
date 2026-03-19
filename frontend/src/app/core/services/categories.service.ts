import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";

export interface CategoryItem {
  id: string;
  name: string;
  description?: string;
}

@Injectable({ providedIn: "root" })
export class CategoriesService {
  constructor(
    private readonly http: HttpClient,
    private readonly api: ApiService
  ) {}

  list(): Observable<CategoryItem[]> {
    return this.http.get<CategoryItem[]>(`${this.api.baseUrl}/categories`);
  }

  create(payload: { name: string; description?: string }): Observable<CategoryItem> {
    return this.http.post<CategoryItem>(`${this.api.baseUrl}/categories`, payload);
  }

  update(id: string, payload: { name?: string; description?: string }): Observable<CategoryItem> {
    return this.http.patch<CategoryItem>(`${this.api.baseUrl}/categories/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api.baseUrl}/categories/${id}`);
  }
}
