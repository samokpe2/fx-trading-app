import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/user/user.entity';

@Entity()
export class OtpVerification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  otp: string;

  @Column({ default: false })
  isUsed: boolean;

  @Column()
  createdAt: Date = new Date();

  @Column({ nullable: true })
  expiresAt: Date;
}
