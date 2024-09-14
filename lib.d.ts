/* eslint-disable prettier/prettier */

const globalData = {
    projectName: '',
    // https环境中用于替换文件url的地址
    fileServerUrl: '',
    baseURL: 'http://10.10.120.201:32501',
    businessURL: 'http://10.10.120.201:30099',
    redirectURL: 'http://10.10.120.211:30101', // 业务中台统一门户访问地址
}

declare interface Window {
    globalData: typeof globalData
}

declare interface RunRecord {
    id: number;
    origin: Object;
    startDate: string;
    distance: string;
    paceParts: number;
    heartRate: number;
    runTime: number;
    moment: string;
    location: Object;
    address: string;
}

type ToSingleKeyValue<T, L extends string = 'label', U extends string = 'value'> =
    {
        readonly label: T[L];
        readonly value: T[U];
    } extends {
        readonly label: infer K;
        readonly value: infer V;
    }
    ? K extends PropertyKey
    ? {
        [Key in K]: V;
    }
    : never
    : never;
type MergeIntersection<A> = A extends infer T
    ? { [Key in keyof T]: T[Key] }
    : never;

type ToKeyValue<T, L extends string = 'label', U extends string = 'value'> = T extends readonly [infer A, ...infer B]
    ? B['length'] extends 0
    ? ToSingleKeyValue<A, L, U>
    : MergeIntersection<ToSingleKeyValue<A, L, U> & ToKeyValue<B, L, U>>
    : [];