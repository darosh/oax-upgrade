import { Info } from 'swagger-schema-official'

export interface IInfoObservable {
  description?: string;
  description_html?: boolean; // eslint-disable-line camelcase
}

export interface IInfoExtended extends Info {
  _: IInfoObservable;
}
