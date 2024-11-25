
import { existsSync } from 'fs';
import { join } from 'path';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
  getStaticProductImage(imageName: string){
    const Path = join(__dirname, '../../static/products', imageName)

    if (!existsSync(Path)) throw new BadRequestException

    return Path
  }
}
