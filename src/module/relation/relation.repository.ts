import { FollowStatus, PrivateStatus } from 'src/constants';
import { Relation } from 'src/entities/relation.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Relation)
export class RelationRepository extends Repository<Relation> {
  async createRelationFollow(
    idUser: number,
    idAuth: number,
    isPrivateUserAuth: PrivateStatus,
  ): Promise<Relation> {
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
    return relationCreate;
  }

  async updateRelationFollow(relation: Relation, typeFollow: FollowStatus): Promise<Relation> {
    return await this.save({
      ...relation,
      is_follow: typeFollow,
    });
  }
}
