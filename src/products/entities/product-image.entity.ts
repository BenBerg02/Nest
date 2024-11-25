import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class Image{
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column("text")
    name: string

    @ManyToOne(
        () => Product,
        product => product.images,
        {onDelete: 'CASCADE'}
    )
    product: string
}