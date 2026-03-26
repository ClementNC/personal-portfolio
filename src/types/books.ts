export type ReadingStatus = "reading" | "finished" | "wishlist";

export interface Book {
  title: string;
  author: string;
  status: ReadingStatus;
  /** Hex colour for the book spine */
  spineColor: string;
  /** Spine width in px (28–44) */
  width: number;
  /** Spine height in px (100–160) */
  height: number;
  /** Rotation in degrees (-2 to +2) */
  tilt: number;
  /** 1–5, only present for status === "finished" */
  rating?: number;
  /** Only present for status === "finished" */
  review?: string;
}
