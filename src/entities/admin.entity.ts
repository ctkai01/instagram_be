import { Exclude } from 'class-transformer';
import {
  Column,
  Entity, PrimaryGeneratedColumn
} from 'typeorm';

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column({ nullable: false, unique: true })
  account: string;

  @Exclude()
  @Column({ nullable: false })
  password?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at?: string;
}
