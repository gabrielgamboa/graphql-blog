import { CreatePost } from '@/posts/domain/dtos/create-post';
import { PostsRepository } from '@/posts/domain/repositories/posts.repository';
import { Post } from '../graphql/models/post';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error';

@Injectable()
export class PrismaPostsRepository implements PostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePost): Promise<Post> {
    const post = await this.prisma.post.create({
      data,
    });

    return post;
  }

  async update(id: string, data: Partial<Post>): Promise<Post> {
    await this.get(id);

    const postUpdated = await this.prisma.post.update({
      where: { id },
      data,
    });

    return postUpdated;
  }

  async findById(id: string): Promise<Post> {
    return this.get(id);
  }

  async findBySlug(slug: string): Promise<Post> {
    const post = await this.prisma.post.findFirst({
      where: { slug: { contains: slug, mode: 'insensitive' } },
    });

    if (!post) throw new ResourceNotFoundError();

    return post;
  }

  async get(id: string): Promise<Post> {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) throw new ResourceNotFoundError();

    return post;
  }
}
