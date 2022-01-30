import { User } from 'src/auth/auth.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('stories')
export class Story {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column({ nullable: true })
  created_by?: number | User;

  @ManyToOne(() => User, (user) => user.stories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'created_by' })
  user: User;
}
