# API
APIs of mine

## Time API
The time API is availible at `https://trnck.dev/time`

### GET Parameters
| Name | Description | Example |
|------|-------------|---------|
| ts   | Current client timestamp (in ms) | 1606995302000 |

### Example responce 
```json
{
  "status":"success",
  "result":{
    "s":135,
    "ms":135022,
    "unix":1606995437022
  }
}
```
