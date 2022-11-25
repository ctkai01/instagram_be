import { Injectable, ParseIntPipe, Query, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { AdminRepository } from './admin.repository';
import { LoginAminDto } from './dto/login-admin-dto';
import * as bcrypt from 'bcryptjs';
import { ResponseData } from 'src/interface';
import { PostService } from '../post/post.service';
import { StoryService } from '../story/story.service';
@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminRepository)
    private adminRepository: AdminRepository,
    private configService: ConfigService,
    private authService: AuthService,
    private postService: PostService,
    private storyService: StoryService,
  ) {}

  async login(loginUserDto: LoginAminDto) {
    // $2a$08$jr6ipK3lUHjLTvRqNErnLOtpowsYhnumuawfVFcdSZxy53oPWZknG
    // admin12345678

    // let data = this.authService.hashData('admin12345678');

    let admin = await this.adminRepository.findOne({
      where: [{
        account: loginUserDto.account
      }]
    })

    if (!admin) {
      throw new UnauthorizedException('Please check your login credentials');
    }

    let checkpass = bcrypt.compareSync(loginUserDto.password, admin.password);

    if (!checkpass) {
      throw new UnauthorizedException('Please check your login credentials');
    } else {
      const responseData: ResponseData = {
        message: 'Login Successfully!',
      };
      return responseData;
    }
  }

  async postReview(pageNumber: number) {
    return this.postService.getPostApprove(pageNumber)
  }

  async postReviewAccept(idPost: number) {
    return this.postService.acceptPostReview(idPost)
  }

  async storiesReview() {
    return this.storyService.getStoriesApprove()
  }

  async storiesReviewAccept(idStory: number) {
    return this.storyService.acceptStoryReview(idStory)

  }
}
