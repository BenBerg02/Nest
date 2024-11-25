import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilters.helper';
import { diskStorage } from 'multer';
import { fileNamer } from './helpers/fileNamer.helper';
import { Response } from 'express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post("products")
  @UseInterceptors( FileInterceptor("file", {
    fileFilter,
    //limits: { fileSize: 100}
    storage: diskStorage(
      {
        destination: './static/products',
        filename: fileNamer
      }
    )
  }) )
  uploadImage(@UploadedFile() file: Express.Multer.File){
    if(!file) throw new BadRequestException("file must be an image")
    return "yes"
  }

  @Get('products/:image')
  findImageProduct(
    @Res() res: Response,
    @Param('image') imageName: string
  ){
    res.sendFile(this.filesService.getStaticProductImage(imageName))
  }
}
