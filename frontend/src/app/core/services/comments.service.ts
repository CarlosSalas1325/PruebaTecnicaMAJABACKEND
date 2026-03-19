import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";

export interface CommentItem {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; name: string; email: string };
}

@Injectable({ providedIn: "root" })
export class CommentsService {
  constructor(
    private readonly http: HttpClient,
    private readonly api: ApiService
  ) {}

  listByPost(postId: string): Observable<CommentItem[]> {
    return this.http.get<CommentItem[]>(`${this.api.baseUrl}/posts/${postId}/comments`);
  }

  create(postId: string, payload: { content: string }): Observable<CommentItem> {
    return this.http.post<CommentItem>(`${this.api.baseUrl}/posts/${postId}/comments`, payload);
  }

  update(postId: string, commentId: string, payload: { content: string }): Observable<CommentItem> {
    return this.http.patch<CommentItem>(`${this.api.baseUrl}/posts/${postId}/comments/${commentId}`, payload);
  }

  delete(postId: string, commentId: string): Observable<void> {
    return this.http.delete<void>(`${this.api.baseUrl}/posts/${postId}/comments/${commentId}`);
  }
}
