export interface IS3Dao {
  uploadImage(
    alias: string,
    imageBase64: string,
    imageFileExtension: string
  ): Promise<string>;
}
