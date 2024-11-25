import {v7 as uuid} from 'uuid'

export const fileNamer = (req: Express.Request, file: Express.Multer.File, cb: Function) => {

    if(!file) return cb(new Error("file is emply"), false)

    const fileExtension = file.mimetype.split('/')[1]
    
    const fileName = `${uuid()}.${fileExtension}`

    cb(null, fileName)
}