import LevelModel from '../model/levelModel';


function invisibleCell(level, x, y) {
    const index = level.index(x, y);
    level.wdata[index] = level.odata[index] = 10;
  }

  /**
     * Generate a level of specific dimensions, with a specific random obstacle round and the type of outer walls.
     * @param   {Number} width           width in cells
     * @param   {Number} height          height in rows
     * @param   {Number} randomWallCount # of random obstacle walls (could be diagonal, horizontal and vertical)
     * @param   {Number} outerWalls      render outer walls or not?
     * @returns {Object} returns a LevelModel
     */
export default function generateLevel(width, height, randomWallCount, outerWalls) {
  width = 70;
  height = 42;

    const level = new LevelModel(width, height, []);

       let rwc = (typeof randomWallCount === "number" ? randomWallCount : 4),
        x, y, i, rwx, rwy, rwl, rwdx, rwdy, ri, rc, hg, hr, vg, vr, 
        wallTypes = new Array(4),
        invisibleCells = [[0, 0], [width - 1, 0], [width - 1, height - 1], [0, height - 1]]; // corner cells.

    if(outerWalls) {
      for(i = 0; i < wallTypes.length; i += 1) {
        wallTypes[i] = 1 + Math.floor(Math.random() * 2);
      }

      hg = Math.floor(Math.random() * (width / 2));
      if(hg % 2 === 0) {
        hg -= 1;
      }
      hr = ((width - 2 - hg) / 2);

      vg = Math.floor(Math.random() * (height / 2));
      if(vg % 2 === 0) {
        vg -= 1;
      }
      vr = ((height - 2 - vg) / 2);

      for(x = 1; x < level.width - 1; x += 1) {
        if(x < vr || x > (level.width - vr - 1)) {
          i = level.index(x, 0);
          level.wdata[i] = level.odata[i] = wallTypes[0];
          i = level.index(x, level.height - 1);
          level.wdata[i] = level.odata[i] = wallTypes[1];  
        }
      }

      for(y = 1; y < level.height - 1; y += 1) {
        if(y < hr || y > (level.height - hr - 1)) {
          i = level.index(0, y);
          level.wdata[i] = level.odata[i] = wallTypes[2];

          i = level.index(level.width - 1, y);
          level.wdata[i] = level.odata[i] = wallTypes[3];  
        }
      }

      for(i = 0; i < invisibleCells.length; i += 1) {
        invisibleCell(level, invisibleCells[i][0], invisibleCells[i][1]);
      }
    }

    for(rc = 0; rc < rwc; rc += 1) {
      // calculate a position for a random wall, somewhere within the walls of the grid. 
      rwx  = Math.floor(3 + Math.random() * (level.width - 6));
      rwy  = Math.floor(3 + Math.random() * (level.height - 6));
      rwl  = Math.floor(3 + Math.random() * 5);
      rwdx = ((rwx < level.width / 2) ? 1 : -1);
      rwdy = ((rwy < level.height / 2) ? 1 : -1);

      for(ri = 0; ri < rwl; ri += 1) {
        i = level.index(rwx, rwy);

        // don't try to make a new block when one already exists! 
        if(level.wdata[i] !== 0) {
          break;
        }

        level.wdata[i] = level.odata[i] = 2;

        rwx += rwdx;
        rwy += rwdy;
      }
    }

    return level;
  }