import type { CourseInfo } from "@/types/notes";

import { CS341 } from "./cs341";
import { CS350 } from "./cs350";
import { CO487 } from "./co487";
import { CS451 } from "./cs451";
import { STAT443 } from "./stat443";
import { CHEM120 } from "./chem120";
import { STAT341 } from "./stat341";
import { CS240 } from "./cs240";
import { CS348 } from "./cs348";
import { MATH239 } from "./math239";
import { STAT331 } from "./stat331";
import { CS241 } from "./cs241";
import { CS245 } from "./cs245";
import { CS251 } from "./cs251";
import { STAT231 } from "./stat231";
import { CS246 } from "./cs246";
import { MATH235 } from "./math235";
import { MATH237 } from "./math237";
import { STAT230 } from "./stat230";
import { CS136 } from "./cs136";
import { MATH136 } from "./math136";
import { MATH138 } from "./math138";
import { MATH135 } from "./math135";
import { MATH137 } from "./math137";

export const COURSES: CourseInfo[] = [
  // 4A
  CO487,
  CS451,
  STAT443,
  CHEM120,
  // 3B
  CS341,
  CS350,
  STAT341,
  // 3A
  CS240,
  CS348,
  MATH239,
  STAT331,
  // 2B
  CS241,
  CS245,
  CS251,
  STAT231,
  // 2A
  CS246,
  MATH235,
  MATH237,
  STAT230,
  // 1B
  CS136,
  MATH136,
  MATH138,
  // 1A
  MATH135,
  MATH137,
];
