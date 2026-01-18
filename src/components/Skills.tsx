import Fuse from "fuse.js/min-basic";
import { brickHeight } from "../util/brickGeometry";
import { Brick } from "./Brick";
import { useSearchValue } from "../hooks/useSearchValue";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { MOBILE_BREAKPOINT_QUERY } from "../constants/styles";
import { SKILLS } from "../constants/skills";

const fuse = new Fuse(SKILLS, { keys: ["name", "tags"], threshold: 0.25 });

export const Skills = () => {
  const searchValue = useSearchValue();
  const results = fuse.search(searchValue);
  const matches = new Set(results.map(({ item }) => item.name));

  const isMobileScreen = useMediaQuery(MOBILE_BREAKPOINT_QUERY);
  const columnCount = isMobileScreen ? 2 : 3;
  const columnHeight = Math.floor(SKILLS.length / columnCount);
  const wallOffset = isMobileScreen ? 2 : 3;
  const spacing = 2;
  const maxDistance = (columnCount - 1) * spacing + wallOffset;
  const maxHeight = (columnHeight - 1) * brickHeight;

  // TODO: sort skills so they appear from top to bottom in order of importance
  // TODO: handle placement if there's overflow. Currently starts by floating at the top

  return SKILLS.map(({ name, color, path }, i) => {
    const column = Math.floor(i / columnHeight);
    const height = maxHeight - (i % columnHeight) * brickHeight;
    const isLastColumn = column === columnCount - 1;
    const isOddColumn = column % 2 === 1;
    const rotationY = isLastColumn || isOddColumn ? Math.PI / 2 : 0;
    const isMatch = matches.has(name) || searchValue === "";
    const x = spacing * column + wallOffset;
    const z = maxDistance - x + wallOffset;

    return (
      <Brick
        key={i}
        delay={height + x}
        label={name}
        color={color}
        icon={path}
        visibility={isMatch ? "normal" : "dimmed"}
        rotation-y={rotationY}
        position={[x, height, z]}
      />
    );
  });
};
