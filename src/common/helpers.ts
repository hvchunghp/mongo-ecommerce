import { instanceToPlain } from 'class-transformer';
import { ICommonReturn, IPageDetail } from './common.interface';
import mongoose from 'mongoose';
import * as os from 'os';
import * as process from 'process';
import { BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';

export function CommonReturn(params: ICommonReturn) {
    return {
        statusCode: params.statusCode,
        status: params.status,
        message: params?.message,
        data: params.data,
    };
}

const checkConnection = () => {
    return mongoose.connections.length;
};

export const checkOverload = () => {
    const _SECOND = 10000;
    setInterval(() => {
        const countConnection = checkConnection();
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        const maxConnection = numCores * 10;
        console.log(`\nMemory usage: ${memoryUsage / 1024 / 1024}MB`);
        console.log(`Connect: ${countConnection}`);

        if (countConnection > maxConnection) {
            console.log('overload');
        }
    }, _SECOND);
};

type dto = { new (...args: any[]): any };
export const newMiddlewareDto = async (ObjDto: dto, req: object) => {
    const dto = new ObjDto();
    let a = Object.assign(dto, req);
    const b = instanceToPlain(a);
    a = Object.assign(dto, b);
    const isValid = await validate(a);
    if (isValid.length > 0) {
        const error = isValid.reduce(
            (sum, el) => Object.assign(sum, el.constraints),
            {},
        );
        throw new BadRequestException(Object.values(error));
    }
    return b;
};

export const paginating = (
    totalCount: any,
    page: number,
    limit: number,
): IPageDetail => {
    const totalDocs =
        totalCount && totalCount.length ? totalCount[0].totalCount : 0;
    const totalPage = Math.ceil(totalDocs / limit);
    const nextPage = page + 1 <= totalPage ? page + 1 : null;
    const prevPage = page - 1 > 0 ? page - 1 : null;
    const hasNextPage = page < totalPage ? true : false;
    const hasPrevPage = page > 1 ? true : false;

    return {
        totalDocs,
        totalPage,
        nextPage,
        prevPage,
        page,
        hasNextPage,
        hasPrevPage,
    };
};
