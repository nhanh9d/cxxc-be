
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Test {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { nullable: true, array: true })
  profileImages: string[];
}
