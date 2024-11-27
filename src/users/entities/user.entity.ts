import { ApiProperty } from "@nestjs/swagger"
import { Product } from "src/products/entities/product.entity"
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"

@Entity("users")
export class User {
    @ApiProperty()
    @PrimaryGeneratedColumn(`uuid`)
    id: string

    @ApiProperty()
    @Column('text',{
        unique: true,
        nullable: false
    })
    email: string

    @ApiProperty()
    @Column('text',{
        nullable: false,
        select: false
    })
    password: string

    @ApiProperty()
    @Column('text')
    fullname: string

    @ApiProperty()
    @Column('bool', {
        default: true
    })
    isActive: boolean

    @ApiProperty()
    @Column('text',{
        array: true,
        default: ['user']
    })
    roles: string[]

    @ApiProperty()
    @OneToMany(
        () => Product,
        product => product.Vendor
    )
    product: Product[]

}
