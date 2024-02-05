export interface SanityAsset {
  url: string;
  originalFilename: string;
  uploadId: string;
  assetId: string;
  extension: string;
  mimeType: string;
  path: string;
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
}

export interface SanityRequest {
  _id: string;
  _type: string;
  title: string;
  description: string;
  lottie: SanityAsset;
  svg: SanityAsset;
  gif: SanityAsset;
}
