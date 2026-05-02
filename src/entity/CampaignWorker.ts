import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BeforeInsert, AfterInsert, ManyToMany } from "typeorm";
import { Event } from "./Event";

@Entity("campaign_workers")
export class CampaignWorker {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    type: 'varchar',
    unique: true,
    generatedType: 'STORED',
    asExpression: `'wya-' || lpad(serial_id::text, 3, '0')`
  })
  worker_id!: string;

  @Column({ type: 'int', generated: 'increment', unique: true })
  serial_id!: number;

  @Column()
  full_name!: string;

  @Column({ unique: true })
  phone_number!: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  lga?: string;

  @Column({ nullable: true })
  ward?: string;

  @Column({ nullable: true })
  polling_unit?: string;

  @Column({ nullable: true })
  occupation?: string;

  @Column({ nullable: true })
  age?: number;

  @Column({ nullable: true })
  gender?: string;

  @Column({ type: "text", nullable: true })
  address?: string;

  @Column({ type: "text", nullable: true })
  reason_to_join?: string;

  @Column({ nullable: true })
  preferred_role?: string;

  @Column({ type: 'boolean', default: true })
  consent!: boolean;

  @ManyToMany(() => Event, event => event.registered_workers)
  registered_events!: Event[];

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;
}