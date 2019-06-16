import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { CreatePostDto } from './post.dto';

@Controller('posts')
export class PostsController {
    @Get()
    indexedDB() {
        return [
            {
                title: "hi"
            }
        ]
    }

    @Get(':id')
    show(@Param() params) {
        return [
            {
                title: `Post ${params.id}`
            }
        ]
    }

    @Post()
    store(@Body() post: CreatePostDto) {
        console.log(post)
    }
}
