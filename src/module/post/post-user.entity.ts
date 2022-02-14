import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'post_user' })
export class PostUser {
  @PrimaryGeneratedColumn('increment')
  id?: string;
}
