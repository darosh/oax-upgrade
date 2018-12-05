import { Response } from 'swagger-schema-official'

export interface IResponseObservable {
  description?: string;
  description_html?: boolean; // eslint-disable-line camelcase
}

export interface IResponseExtended extends Response {
  _: IResponseObservable;
}
