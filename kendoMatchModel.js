class KendoMatchModel {
  static MAX_MATCH_POINTS = 2

  static POINT_TYPES = {
    men: 'M',
    kote: 'K',
    do: 'D',
    tsuki: 'M',
    hansoku: 'H',
    hantei: 'Ht',
    chosen: 'Ch',
    empty: ' ',
  }

  static MATCH_STATUS = {
    draw: 'DRAW',
    onePoint: 'ONE_POINT',
    extraTime: 'EXTRA_TIME',
  }

  static setMatchSide = (preset = {}) => ({
    name: '',
    points: [],
    fault: false,
    ...this.clearObjectKeys(this.parseMatchSideFields(preset), ['name', 'points', 'fault']),
  })

  static setMatch = (preset = {}) => this.updateMatch({
    status: null,
    l: this.setMatchSide(),
    r: this.setMatchSide(),
    isCurrent: false,
  }, preset)

  static isValidStatus = (status) => Object.values(this.MATCH_STATUS).includes(status)

  static parseMatchFields = (matchObject) => {
    const parsedMatchObject = matchObject && { ...matchObject };
    if (parsedMatchObject) {
      const matchStatus = parsedMatchObject.status;
      if (matchStatus && !this.isValidStatus(matchStatus)) {
        parsedMatchObject.status = null;
      }
      if (parsedMatchObject.isCurrent) {
        parsedMatchObject.isCurrent = Boolean(parsedMatchObject.isCurrent);
      }
      ['l', 'r'].forEach((s) => {
        if (parsedMatchObject[s]) {
          parsedMatchObject[s] = this.parseMatchSideFields(parsedMatchObject[s]);
        }
      });
    }
    return parsedMatchObject;
  }

  static isValidPoint = (point) => Object.values(this.POINT_TYPES).includes(point)

  static parseMatchSideFields = (matchSideObject) => {
    const parsedMatchSideObject = matchSideObject && { ...matchSideObject };
    if (parsedMatchSideObject) {
      const matchSidePoints = parsedMatchSideObject.points;
      if (matchSidePoints) {
        if (Array.isArray(matchSidePoints)) {
          parsedMatchSideObject.points = matchSidePoints.filter(this.isValidPoint);
        } else {
          delete parsedMatchSideObject.points;
        }
      }
      if (parsedMatchSideObject.name) {
        parsedMatchSideObject.name = String(parsedMatchSideObject.name);
      }
      if (parsedMatchSideObject.fault) {
        parsedMatchSideObject.fault = Boolean(parsedMatchSideObject.fault);
      }
    }
    return parsedMatchSideObject;
  }

  static newMatch = ({ leftName, rightName, isCurrent }) => this.setMatch({
    l: this.setMatchSide({ name: leftName }),
    r: this.setMatchSide({ name: rightName }),
    isCurrent,
  })

  static addPoint = (originalMatch, side, point) => {
    const changes = { [side]: { points: [...originalMatch[side].points, point] } };
    return this.updateMatch(originalMatch, changes);
  }

  static updateMatch = (originalMatch, changes) => {
    const parsedChanges = this.clearObjectKeys(this.parseMatchFields(changes), ['status', 'l', 'r', 'isCurrent']);
    const matchCloned = {
      ...originalMatch,
    };
    Object.keys(parsedChanges).forEach((changeKey) => {
      let changeValue = parsedChanges[changeKey];
      if (typeof changeValue === 'object' && changeValue !== null) {
        changeValue = {
          ...(matchCloned[changeKey] || {}),
          ...changeValue,
        };
      }
      matchCloned[changeKey] = changeValue;
    });

    return matchCloned;
  }

  static finishMatch = (originalMatch) => {
    const matchCloned = {
      ...originalMatch,
    };
    matchCloned.isCurrent = false;
    const sidePointsLenght = (side) => originalMatch[side].points.length;
    let nextStatus = null;
    if (sidePointsLenght('l') === sidePointsLenght('r')) {
      nextStatus = this.MATCH_STATUS.draw;
    } else if (Math.max(sidePointsLenght('l'), sidePointsLenght('r')) === 1) {
      nextStatus = this.MATCH_STATUS.onePoint;
    }
    matchCloned.status = nextStatus;
    return matchCloned;
  }

  // private
  static clearObjectKeys = (originalObj, alowedKeys) => {
    if (originalObj && alowedKeys) {
      const newObj = alowedKeys.reduce((o, k) => {
        const newO = { ...o };
        if (originalObj[k]) {
          newO[k] = originalObj[k];
        }
        return newO;
      }, {});
      return newObj;
    }
    return originalObj;
  }
}
export default KendoMatchModel;
