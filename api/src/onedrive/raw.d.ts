export declare function onedrive_raw({ path, FileName }: {
    path?: string | undefined;
    FileName?: string | undefined;
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
