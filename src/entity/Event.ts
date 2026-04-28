import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany, JoinTable } from "typeorm";
import { CampaignWorker } from "./CampaignWorker";

@Entity("events")
export class Event {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column("text")
    description!: string;

    @Column()
    date!: Date;

    @Column()
    location!: string;

    @Column({ nullable: true })
    image_url?: string;

    @Column({ nullable: true })
    cloudinary_id?: string;

    @ManyToMany(() => CampaignWorker, worker => worker.registered_events)
    @JoinTable({
        name: "event_registrations",
        joinColumn: { name: "event_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "worker_id", referencedColumnName: "id" },
    })
    registered_workers!: CampaignWorker[];

    @CreateDateColumn()
    created_at!: Date;
}