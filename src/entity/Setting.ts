import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Setting {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ nullable: true })
    siteTitle!: string;

    @Column({ nullable: true })
    contactEmail!: string;

    @Column({ nullable: true })
    phone!: string;

    @Column({ nullable: true })
    address!: string;
}