import KendoMatchModel from '../kendoMatchModel';
// const
const NAME1 = 'john';
const NAME2 = 'jack';
const EMPTYMATCHSIDE = {
  name: '',
  points: [],
  fault: false,
};
const FILLEDMATCHSIDE = {
  name: 'John',
  points: ['M'],
  fault: true,
};
const EMPTYMATCH = {
  status: null,
  l: { ...EMPTYMATCHSIDE },
  r: { ...EMPTYMATCHSIDE },
  isCurrent: false,
};
// helpers
const setField = (field, value, emptyModel) => {
  const matchingObject = { ...emptyModel, ...{ [field]: value } };
  const settingsObj = {
    [field]: value,
  };
  return { matchingObject, settingsObj };
};
const setMatchSideField = (field) => setField(field, FILLEDMATCHSIDE[field], EMPTYMATCHSIDE);
const setMatchField = (field, value) => setField(field, value, EMPTYMATCH);
describe('set match side', () => {
  test('set empty match side', () => {
    const newMatchSide = KendoMatchModel.setMatchSide();
    expect(newMatchSide).toMatchObject(EMPTYMATCHSIDE);
  });
  test('set full match side', () => {
    const newMatchSide = KendoMatchModel.setMatchSide(FILLEDMATCHSIDE);
    expect(newMatchSide).toMatchObject(FILLEDMATCHSIDE);
  });
  test('set name match side', () => {
    const { matchingObject, settingsObj } = setMatchSideField('name');
    const newMatchSide = KendoMatchModel.setMatchSide(settingsObj);
    expect(newMatchSide).toMatchObject(matchingObject);
  });
  test('set points match side', () => {
    const { matchingObject, settingsObj } = setMatchSideField('points');
    const newMatchSide = KendoMatchModel.setMatchSide(settingsObj);
    expect(newMatchSide).toMatchObject(matchingObject);
  });
  test('set fault match side', () => {
    const { matchingObject, settingsObj } = setMatchSideField('fault');
    const newMatchSide = KendoMatchModel.setMatchSide(settingsObj);
    expect(newMatchSide).toMatchObject(matchingObject);
  });
  test('should ignore fields out of the model', () => {
    const matchSideSettings = { ...FILLEDMATCHSIDE, ...{ other: 1, points: 2 } };
    const matchingObject = { ...FILLEDMATCHSIDE, ...{ points: [] } };
    const newMatchSide = KendoMatchModel.setMatchSide(matchSideSettings);
    expect(newMatchSide).toMatchObject(matchingObject);
  });
});
describe('set match', () => {
  test('set empty match', () => {
    const newMatch = KendoMatchModel.setMatch();
    expect(newMatch).toMatchObject(EMPTYMATCH);
  });
  test('set left side match', () => {
    const { matchingObject, settingsObj } = setMatchField('l', FILLEDMATCHSIDE);
    const newMatch = KendoMatchModel.setMatch(settingsObj);
    expect(newMatch).toMatchObject(matchingObject);
  });
  test('set right side match', () => {
    const { matchingObject, settingsObj } = setMatchField('r', FILLEDMATCHSIDE);
    const newMatch = KendoMatchModel.setMatch(settingsObj);
    expect(newMatch).toMatchObject(matchingObject);
  });
  test('should ignore fields out of the model', () => {
    const matchSettings = { ...EMPTYMATCH, ...{ other: 1 } };
    const newMatch = KendoMatchModel.setMatch(matchSettings);
    expect(newMatch).toMatchObject(EMPTYMATCH);
  });
  test('should avoid invalid match status', () => {
    const matchSettings = { ...EMPTYMATCH, ...{ status: 'INVALID' } };
    const newMatch = KendoMatchModel.setMatch(matchSettings);
    expect(newMatch).toMatchObject(EMPTYMATCH);
  });
});
describe('new match', () => {
  test('set empty match', () => {
    const matchingObject = {
      ...EMPTYMATCH,
    };
    matchingObject.l.name = NAME1;
    matchingObject.r.name = NAME2;
    const newMatch = KendoMatchModel.newMatch({ leftName: NAME1, rightName: NAME2 });
    expect(newMatch).toMatchObject(matchingObject);
  });
});
describe('update match', () => {
  test('set empty match', () => {
    const newMatch = KendoMatchModel.newMatch({ leftName: NAME1, rightName: NAME2 });
    const updatedMatch = KendoMatchModel.updateMatch(newMatch, { isCurrent: true });
    const matchingObject = {
      ...newMatch,
      isCurrent: true,
    };
    expect(updatedMatch).toMatchObject(matchingObject);
  });
});
describe('add point', () => {
  test('set empty match', () => {
    const newMatch = KendoMatchModel.newMatch({ leftName: NAME1, rightName: NAME2 });
    let updatedMatch = KendoMatchModel.addPoint(newMatch, 'l', 'M');
    expect(updatedMatch.l.points).toMatchObject(['M']);
    updatedMatch = KendoMatchModel.addPoint(updatedMatch, 'r', 'K');
    expect(updatedMatch.r.points).toMatchObject(['K']);
    updatedMatch = KendoMatchModel.addPoint(updatedMatch, 'l', 'K');
    expect(updatedMatch.l.points).toMatchObject(['M', 'K']);
  });
});
describe('finish match', () => {
  test('finish draw match', () => {
    const newMatch = KendoMatchModel.newMatch({ leftName: NAME1, rightName: NAME2 });
    let updatedMatch = KendoMatchModel.updateMatch(newMatch, { isCurrent: true });
    expect(updatedMatch.isCurrent).toBe(true);
    updatedMatch = KendoMatchModel.addPoint(updatedMatch, 'l', 'M');
    updatedMatch = KendoMatchModel.addPoint(updatedMatch, 'r', 'K');
    updatedMatch = KendoMatchModel.finishMatch(updatedMatch);
    expect(updatedMatch.status).toBe(KendoMatchModel.MATCH_STATUS.draw);
    expect(updatedMatch.isCurrent).toBe(false);
  });
  test('finish one point match', () => {
    const newMatch = KendoMatchModel.newMatch({ leftName: NAME1, rightName: NAME2 });
    let updatedMatch = KendoMatchModel.updateMatch(newMatch, { isCurrent: true });
    updatedMatch = KendoMatchModel.addPoint(updatedMatch, 'l', 'M');
    updatedMatch = KendoMatchModel.finishMatch(updatedMatch);
    expect(updatedMatch.status).toBe(KendoMatchModel.MATCH_STATUS.onePoint);
    expect(updatedMatch.isCurrent).toBe(false);
  });
  test('finish two points match', () => {
    const newMatch = KendoMatchModel.newMatch({ leftName: NAME1, rightName: NAME2 });
    let updatedMatch = KendoMatchModel.updateMatch(newMatch, { isCurrent: true });
    updatedMatch = KendoMatchModel.addPoint(updatedMatch, 'l', 'M');
    updatedMatch = KendoMatchModel.addPoint(updatedMatch, 'l', 'K');
    updatedMatch = KendoMatchModel.finishMatch(updatedMatch);
    expect(updatedMatch.status).toBe(null);
    expect(updatedMatch.isCurrent).toBe(false);
  });
});
