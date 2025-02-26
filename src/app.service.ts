import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHello(): string {
        return 'API Aqua Kinetics v.1.0';
    }
}
