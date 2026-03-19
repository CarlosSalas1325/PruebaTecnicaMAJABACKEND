import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";

export interface PostItem {
  id: string;
  title: string;
  content: string;
  status: "draft" | "published";
  createdAt: string;
  author: { id: string; name: string; email: string };
  categories: { id: string; name: string }[];
}

interface ListResponse {
  data: PostItem[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

@Injectable({ providedIn: "root" })
export class PostsService {
  constructor(
    private readonly http: HttpClient,
    private readonly api: ApiService
  ) {}

  list(filters: Record<string, string | number>): Observable<ListResponse> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        params = params.set(key, String(value));
      }
    });

    return this.http.get<ListResponse>(`${this.api.baseUrl}/posts`, { params });
  }

  getById(id: string): Observable<PostItem> {
    return this.http.get<PostItem>(`${this.api.baseUrl}/posts/${id}`);
  }

  create(payload: { title: string; content: string; status: string; categoryIds: string[] }): Observable<PostItem> {
    return this.http.post<PostItem>(`${this.api.baseUrl}/posts`, payload);
  }

  update(id: string, payload: { title?: string; content?: string; status?: string; categoryIds?: string[] }): Observable<PostItem> {
    return this.http.patch<PostItem>(`${this.api.baseUrl}/posts/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api.baseUrl}/posts/${id}`);
  }
}
