import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compression from 'compression';
import { checkOverload } from './common/helpers';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    app.use(helmet());
    app.use(compression());
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
        }),
    );
    const config = new DocumentBuilder()
        .setTitle('Library manage system')
        .setDescription('Library manage system')
        .setVersion('1.0')
        .addTag('Library manage system')
        .addBearerAuth({
            type: 'http',
            name: 'Authorization',
            in: 'header',
        })
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/docs', app, document);
    await app.listen(8000);
}
bootstrap();
checkOverload();
