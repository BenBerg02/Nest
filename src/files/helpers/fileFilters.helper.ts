
export const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: Function) => {

    if(!file) return cb(new Error("file is emply"), false)

    const fileExtension = file.mimetype.split('/')[1]
    const validExtension = ['jpg', 'jpeg', 'png']

    

    if(validExtension.includes(fileExtension)){
        console.log(fileExtension)
        return cb(null, true)
    }

    cb(null, false)
}