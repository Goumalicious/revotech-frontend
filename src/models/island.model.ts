export interface Island {
    objectId: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    location: number[];
    url: string;
    short_info: string;
    description: string;
    order: number;
    photo: string;
    photo_thumb: string;
    image_file?: Parse.File;
    my_photo_thumb?: string;
}