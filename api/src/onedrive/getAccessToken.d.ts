/**
 * 返回参数：\
 * {t: number时间, r: [][]}\
 * r下4个string\
 * [分享链接，组织sharepoint域名，token，本次请求api]
 * @returns {*}
 */
export declare function getAccessTokens(): Promise<{
    t: number;
    r: [string, string, string, string][];
}>;
