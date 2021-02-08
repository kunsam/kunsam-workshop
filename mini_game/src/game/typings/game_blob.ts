export namespace GameBlobNamespace {
  export interface ObjBlobPropsConfig {
    radius: number;
    numPointMasses: number;
  }

  export interface ObjBlobPropsData extends ObjBlobPropsConfig {
    cx: number;
    cy: number;
  }

  export interface ObjBlobProps extends ObjBlobPropsData {
    id: string;
  }

  export interface BlobCollectiveConfig {
    firstBlob: ObjBlobPropsConfig;
    collectMaxNum: number;
  }

  export interface BlobCollectiveProps {
    id: string;
    firstBlob: ObjBlobProps;
    collectMaxNum: number;
  }
}
