import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

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

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();