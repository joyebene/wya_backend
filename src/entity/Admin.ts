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

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        // This combined hook will run for both inserts and updates.
        // It checks if the password field is present and if it's not already a long hash.
        // Bcrypt hashes are typically 60 characters long.
        if (this.password && this.password.length < 50) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }

    // Method to compare passwords
    async comparePassword(password: string): Promise<boolean> {
        if (!this.password) return false;

        return bcrypt.compare(password, this.password);
    }
}