import { Injectable, ParseIntPipe, Query, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { AdminRepository } from './admin.repository';
import { LoginAminDto } from './dto/login-admin-dto';
import * as bcrypt from 'bcryptjs';
import { Pagination, ResponseData } from 'src/interface';
import { PostService } from '../post/post.service';
import { StoryService } from '../story/story.service';
import { calcPaginate, paginateResponse } from 'src/untils/paginate-response';
import { User } from 'src/entities/auth.entity';
import { UserAdminCollection } from 'src/resource/user/user-admin.collection';
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

  async allUser(pageNumber: number) {
    const users = await this.authService.getAllUser()
 
    const [take, page, skip] = calcPaginate(
      this.configService.get('follow.take'),
      pageNumber,
    );

    const pagination: Pagination = {
      skip,
      take,
    };

    let postsPaginate;
    let count;

    [postsPaginate, count] = new User().getUserCountPaginate(
      users,
      pagination,
    );

    const postsCollection = await UserAdminCollection(postsPaginate)


    const responseData: ResponseData = {
      message: 'Get users Successfully!',
      data: paginateResponse([postsCollection, count], page, take),
    };
    return responseData;
  }

  async deleteUser(idUser: number) {

    const result = await this.authService.deleteUser(idUser);

    console.log("Result: ", result)
    const responseData: ResponseData = {
      message: 'Delete User Successfully!',
    };
    return responseData
  }


  async deletePost(idPost: number) {

    const responseData = await this.postService.deletePostAdmin(idPost);

    return responseData
  }

  async deleteStory(idStory: number) {

    const responseData = await this.storyService.deleteStoryAdmin(idStory);

    return responseData
  }

  
}
