import { Product } from "src/products/entities/product.entity"
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"

@Entity("users")
export class User {
    @PrimaryGeneratedColumn(`uuid`)
    id: string

    @Column('text',{
        unique: true,
        nullable: false
    })
    email: string

    @Column('text',{
        nullable: false,
        select: false
    })
    password: string

    @Column('text')
    fullname: string

    @Column('bool', {
        default: true
    })
    isActive: boolean

    @Column('text',{
        array: true,
        default: ['user']
    })
    roles: string[]

    @OneToMany(
        () => Product,
        product => product.Vendor
    )
    product: Product[]

}
