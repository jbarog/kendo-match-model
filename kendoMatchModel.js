class KendoMatchModel {
  // MatchSideModel = {
  //   name:{type:String},
  //   points:{type:Array},
  //   fault: {type:Boolean},
  // }
  static MAX_MATCH_POINTS = 2

  static DEFAULT_POINTS = {
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

  static setMatchSide = (preset) => ({
    name: '',
    points: [],
    fault: false,
    ...this.clearObjectKeys(preset, ['name', 'points', 'fault']),
  })

  static setMatch = (preset) => ({
    status: null,
    l: this.setMatchSide(),
    r: this.setMatchSide(),
    isCurrent: false,
    ...this.clearObjectKeys(this.validateMatchFields(preset), ['status', 'l', 'r', 'isCurrent']),
  })

  static newMatch = ({ leftName, rightName }) => this.setMatch({
    l: { name: leftName },
    r: { name: rightName },
  })

  static validateMatchFields = (matchObject) => {
    const newMatchObject = matchObject && { ...matchObject };
    if (newMatchObject) {
      const matchStatus = newMatchObject.status;
      if (matchStatus && !Object.values(this.MATCH_STATUS).includes(matchStatus)) {
        newMatchObject.status = null;
      }
    }
    return newMatchObject;
  }

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
