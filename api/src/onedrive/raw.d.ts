export declare function onedrive_raw({ path, drive }: {
    path?: string | undefined;
    drive?: string | undefined;
}): Promise<{
    errors: {
        message: string;
    }[];
    dlinks?: undefined;
} | {
    dlinks: {
        sharelink: string;
        dlink: any;
    }[];
    errors?: undefined;
}>;
