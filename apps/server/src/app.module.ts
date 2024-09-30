import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MenuModule } from './menu/menu.module';
import { AuthModule } from './auth/auth.module';
import { NewsModule } from './news/news.module';
import { GalleryModule } from './gallery/gallery.module';
import { OrderModule } from './order/order.module';
import { CartModule } from './cart/cart.module';
import { SiteModule } from './site/site.module';
import { ContactModule } from './contact/contact.module';
import { ReportModule } from './report/report.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    MenuModule,
    AuthModule,
    NewsModule,
    GalleryModule,
    OrderModule,
    CartModule,
    SiteModule,
    ContactModule,
    ReportModule,
  ],
  providers: [],
})
export class AppModule {}
