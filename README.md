# kendo-match-model
Model for unify format of a kendo match

## Table of Contents
 - [Model Description](#-model-description)
 - [Install](#-install)
 - [Usage](#-usage)
 - [File Structure of App](#-file-structure-of-app)

## Model Description

This moudule exporta a set of methods that can be used as factory for a Kendo match model

A kendo match will be represented in this model as:
```
{
  status: String or null,
  l: MATCHSIDEMODEL,
  r: MATCHSIDEMODEL,
  isCurrent: Boolean
}
```
| Property  |  Description | Default  | Valid values  |
| ------------- |:-------------| :-------------:| -----|
| status |State of match| null|DRAW, ONE_POINT, EXTRA_TIME|
| l |Left side match player| empty MATCHSIDEMODEL |MATCHSIDEMODEL|
| r |Right side match player| empty MATCHSIDEMODEL |MATCHSIDEMODEL|
| isCurrent |It is current an active match?| false|true,fase|

Where a MATCHSIDEMODEL is like:
```
{
  name: String,
  points: Array of Strings,
  fault: Boolean
}
```
| Property  |  Description | Default  | Valid values  |
| ------------- |:-------------| :-------------:| -----|
| name |name for player| ""|any string|
| points |Array of Points| [] | array of strings|
| fault |playes has a fault?| false|true,fase|
So, bringing everything together into an object will be like
```
{
  status: null,
  l: {
      name: '',
      points: [],
      fault: false
  },
  r: {
      name: '',
      points: [],
      fault: false
  },
  isCurrent: false
}
```
## Install

```bash
npm install --save kendo-match-model
```

## Usage
First import the model
```
import KendoMatchModel from '../kendoMatchModel';
```
## Constants
### MAX_MATCH_POINTS
Default max points per side on a match
```
KendoMatchModel.MAX_MATCH_POINTS
```
Value:
```
2
```
### POINT_TYPES
Default valid points strings
```
KendoMatchModel.POINT_TYPES
```
Value:
```
{
  men: 'M',
  kote: 'K',
  do: 'D',
  tsuki: 'M',
  hansoku: 'H',
  hantei: 'Ht',
  chosen: 'Ch',
  empty: ' '
}
```
### MATCH_STATUS
Default valid match status
```
KendoMatchModel.MATCH_STATUS
```
Value:
```
{
  draw: 'DRAW',
  onePoint: 'ONE_POINT',
  extraTime: 'EXTRA_TIME'
}
```
## Methods
### newMatch
Create a new match.
```
KendoMatchModel.newMatch({
  leftName:'John',
  rightName:'Jack'
})
```
Returns:
```
{
  status: null,
  l: {
      name: 'John',
      points: [],
      fault: false
  },
  r: {
      name: 'Jack',
      points: [],
      fault: false
  },
  isCurrent: false
}
```

### updateMatch
Update some properties of a match
```
KendoMatchModel.updateMatch(currentMatch, { isCurrent: true })
```

### addPoint
Add a point to a side
```
KendoMatchModel.addPoint(currentMatch, 'l', KendoMatchModel.POINT_TYPES.men)
```

### finishMatch
When a match is finished a proper status is set and isCurrent will be false.
```
KendoMatchModel.finishMatch(currentMatch)
```


### setMatch
Input: Partial MATCHMODEL or null.
```
KendoMatchModel.setMatch({
  isCurrent:true,
  r: {
      name: 'Jack'
  },
})
```
Returns:
```
{
  status: null,
  l: {
      name: '',
      points: [],
      fault: false
  },
  r: {
      name: 'Jack',
      points: [],
      fault: false
  },
  isCurrent: true
}
```

### setMatchSide
Input: Partial MATCHSIDEMODEL or null.
```
KendoMatchModel.setMatchSide({
  name: 'Jack'
})
```
Returns:
```
{
  name: 'Jack',
  points: [],
  fault: false
}
```

### isValidStatus
Check status name validity
```
KendoMatchModel.isValidStatus('DRAW')//true
```

### isValidPoint
Check point name validity
```
KendoMatchModel.isValidPoint('M')//true
```
