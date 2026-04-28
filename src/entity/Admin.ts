import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate } from "typeorm";
import bcrypt from "bcryptjs";

@Entity()
export class Admin {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ nullable: true })
    name?: string;

    @Column({ unique: true })
    email!: string;

    @Column({ nullable: true })
    phone!: string;

    @Column()
    password?: string;

    @Column({ nullable: true })
    refreshToken?: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    // This hook will automatically hash the password before it's saved to the database
    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password && !this.password.startsWith("$2a$")) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }

    // Method to compare passwords
    async comparePassword(password: string): Promise<boolean> {
        if (!this.password) return false;

        return bcrypt.compare(password, this.password);
    }
}