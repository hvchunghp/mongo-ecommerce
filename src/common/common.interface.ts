import { HttpStatus } from '@nestjs/common';
import { EReturnStatus } from './common.constant';

export interface IUser {
    userId?: string;
    email: string;
}

export interface ICommonReturn<T = any> {
    data: T;
    statusCode: HttpStatus;
    status: EReturnStatus;
    message?: string;
}

export interface IPageDetail {
    totalDocs: number | null;
    totalPage: number | null;
    nextPage: number | null;
    prevPage: number | null;
    page: number | null;
    hasNextPage: boolean | null;
    hasPrevPage: boolean | null;
  }