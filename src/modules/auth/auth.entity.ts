import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseEntity } from 'src/utils/base.entity';

@Entity('User')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  refreshToken: string | null;
}
