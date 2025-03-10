import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable CORS
    app.enableCors({
        origin: true,
        credentials: true,
        optionsSuccessStatus: 200,
    });

    app.useGlobalPipes(
        new ValidationPipe({
            exceptionFactory: (errors) => {
                console.log(errors);
                return new BadRequestException(errors);
            },
        }),
    );

        // Настройка Swagger
        const config = new DocumentBuilder()
        .setTitle('Hotel Aggregator API')
        .setDescription('API documentation for Hotel Aggregator')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);


    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();