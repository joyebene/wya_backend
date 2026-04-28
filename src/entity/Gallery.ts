import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("gallery")
export class Gallery {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  image_url!: string;

  @Column()
  cloudinary_id!: string;

  @Column({ nullable: true })
  title?: string;

  @Column()
  category?: string;

  @CreateDateColumn()
  created_at!: Date;
}