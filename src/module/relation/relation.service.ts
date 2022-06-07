import { ResponseData } from 'src/interface/response.interface';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository } from 'typeorm';
import { RelationRepository } from './relation.repository';
import { FollowUserDto } from './dto/follow-user-dto';
import { FollowStatus } from 'src/constants';
import { User } from 'src/entities/auth.entity';
import { Relation } from 'src/entities/relation.entity';

@Injectable()
export class RelationService {
  constructor(
    @InjectRepository(RelationRepository)
    private relationRepository: RelationRepository,
  ) {}

  async followUser(
    idUser: number,
    userAuth: User,
    followUserDto: FollowUserDto,
  ) {
    // try {
    const userFollow = await getRepository(User).findOne({ id: idUser });
    if (!userFollow) {
      throw new InternalServerErrorException('User not found');
    }

    const checkExistRelation = await this.relationRepository.findOne({
      where: { user_id: userAuth.id, friend_id: idUser },
    });

    if (checkExistRelation) {
      if (
        checkExistRelation.is_follow === FollowStatus.FOLLOW &&
        followUserDto.type === FollowStatus.FOLLOW
      ) {
        throw new InternalServerErrorException(
          'You has been following this user',
        );
      }

      if (
        checkExistRelation.is_follow === FollowStatus.PENDING_FOLLOW &&
        followUserDto.type === FollowStatus.FOLLOW
      ) {
        throw new InternalServerErrorException(
          'You has been send request following',
        );
      }

      if (
        checkExistRelation.is_follow === FollowStatus.UN_FOLLOW &&
        followUserDto.type === FollowStatus.UN_FOLLOW
      ) {
        throw new InternalServerErrorException('You not following this user');
      }
    } else {
      if (followUserDto.type === FollowStatus.UN_FOLLOW) {
        throw new InternalServerErrorException('You not following this user');
      }
    }

    let relation: Promise<Relation>;
    if (!checkExistRelation && followUserDto.type === FollowStatus.FOLLOW) {
      relation = this.relationRepository.createRelationFollow(
        idUser,
        userAuth.id,
        userAuth.is_private,
      );
    } else if (checkExistRelation) {
      relation = this.relationRepository.updateRelationFollow(
        checkExistRelation,
        followUserDto.type,
      );
    }
    if (relation) {
      const responseData: ResponseData = {
        message:
          followUserDto.type === FollowStatus.FOLLOW
            ? 'Follow user Successfully'
            : 'UnFollow user Successfully',
      };
      return responseData;
    }
    // } catch (err) {
    //   console.log(err);
    // }
  }
}
