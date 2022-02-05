import { EntityRepository, Repository } from 'typeorm';
import { AbstractPolymorphicRepository } from 'typeorm-polymorphic';
import { Media } from './media.entity';

@EntityRepository(Media)
export class MediaRepository extends Repository<Media> {}
