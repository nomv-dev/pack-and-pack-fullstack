export interface IArrayStringString {
    [ key : string ] : string
}

export interface IArrayStringAny {
    [ key : string ] : any
}

export interface IArrayStringRegExp {
    [ key : string ] : RegExp
}

export interface IArrayStringType<T> {
    [ key : string ] : T
}