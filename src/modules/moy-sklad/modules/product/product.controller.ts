import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { SearchBaseParams } from 'src/types/search-base-params';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getProducts(@Query() query: SearchBaseParams) {
    return this.productService.getProducts(query);
  }

  @Get(':id/images')
  async getProductImages(@Param('id') id: string) {
    return this.productService.getProductImages(id);
  }
}
