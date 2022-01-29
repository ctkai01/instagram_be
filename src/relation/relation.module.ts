import { Module } from '@nestjs/common';
import { RelationService } from './relation.service';
import { RelationController } from './relation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/auth.repository';
import { RelationRepository } from './relation.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository, RelationRepository])],
  providers: [RelationService],
  controllers: [RelationController],
})
export class RelationModule {}
