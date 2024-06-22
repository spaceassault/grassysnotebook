
export function getThumbnailUrl(originalUrl: string, width: number, height: number){
    const urlParts = originalUrl.split('/upload/');
    // if the image is not from cloudinary, return the original url
    if (urlParts.length !== 2) {
      return originalUrl;
    }
    const transformation = `w_${width},h_${height},c_fill`;
    return `${urlParts[0]}/upload/${transformation}/${urlParts[1]}`;
  }