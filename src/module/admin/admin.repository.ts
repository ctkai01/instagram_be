import { Admin } from 'src/entities/admin.entity';
import { EntityRepository, Repository } from 'typeorm';
import _ = require('lodash');

@EntityRepository(Admin)
export class AdminRepository extends Repository<Admin> {
 
}
