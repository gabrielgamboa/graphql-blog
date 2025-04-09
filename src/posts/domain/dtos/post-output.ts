export interface PostOutput {
  id: string;
  title: string;
  slug: string;
  authorId: string;
  createdAt: Date;
  publishedAt?: Date | null;
}
