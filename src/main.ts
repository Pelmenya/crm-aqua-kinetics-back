import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { RolesGuard } from './modules/user/user.role.guard';

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

    const reflector = app.get(Reflector);
    app.useGlobalGuards(new RolesGuard(reflector));

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();