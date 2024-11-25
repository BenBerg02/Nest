import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Image } from "./product-image.entity";


@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('text',{
        unique: true
    })
    title: string

    @Column('float', {
        default: 0,
        
    })
    price: number

    @Column('text', {
        nullable: true
    })
    description: string

    @Column('text', {
        unique: true
    })
    slug:string

    @Column('int', {
        default: 0
    })
    stock: number

    @Column('text', {
        array: true
    })
    sizes: string[]

    @Column('text')
    gender: string

    @Column('text', {
        array: true,
        default: []
    })
    tags: string[]

    @OneToMany(
        () => Image,
        productImage => productImage.product,
        {
            cascade: true,
            eager: true
        }
    )
    images?: Image[]

    @BeforeInsert()
    checkSlug(){
        if(!this.slug){
            this.slug = this.title.toLowerCase()
              .replaceAll(" ", "-")
              .replaceAll("'", "")
        }
        this.slug = this.slug.toLowerCase()
            .replaceAll(" ", "-")
            .replaceAll("'", "")
          
    }

    @BeforeUpdate()
    updateSlug(){
        
        this.slug = this.slug.toLowerCase()
        .replaceAll(" ", "-")
        .replaceAll("'", "")
        
    }

}
