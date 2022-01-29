import { InternalServerErrorException } from '@nestjs/common';
import { FollowStatus } from 'src/post/enum/follow-status.enum';
import { EntityRepository, Repository } from 'typeorm';
import { PrivateStatus } from './../auth/enum/private.enum';
import { Relation } from './relation.entity';

@EntityRepository(Relation)
export class RelationRepository extends Repository<Relation> {
  async createRelationFollow(
    idUser: number,
    idAuth: number,
    isPrivateUserAuth: PrivateStatus,
  ) {
    const data: Relation = {
      user_id: idAuth,
      friend_id: idUser,
      is_follow:
        isPrivateUserAuth === PrivateStatus.PRIVATE
          ? FollowStatus.PENDING_FOLLOW
          : FollowStatus.FOLLOW,
    };

    const relation = this.create(data);
    const relationCreate = await this.save(relation);
    console.log(relation);
    return relationCreate;
  }

  async updateRelationFollow(relation: Relation, typeFollow: FollowStatus) {
    console.log('Type', typeFollow);
    return await this.save({
      ...relation,
      is_follow: typeFollow,
    });
  }
}
