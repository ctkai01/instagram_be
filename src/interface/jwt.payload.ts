export interface JWTPayload {
    sub: number,
    userName: string,
    iat: number,
    exp: number
}