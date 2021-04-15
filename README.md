# API
APIs of mine

## Responce times
| Name of function | Average responce time (ms) |
|------------------|-----------------------|
| Time difference  | 32.7 |
| UNIX time | 241.4 |
| Ping | 788.83 |

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

### JS Implementation
```js
const timestamp = Date.now();
fetch(`https://trnck.dev/time?ts=${timestamp}`).then(f => f.json()).then(f => {
  const nowstamp = Date.now()  
  console.table({adjusted: Math.round(f.result.ms - (nowstamp - timestamp) / 2), raw: f.result.ms})
})
```


### Limitations
Due to the [One Way Latency problem](http://twistedoakstudios.com/blog/Post2353_when-one-way-latency-doesnt-matter), there is no way to calculate the exact time that passes between the client and the server.

## Ping API
The ping API is availible at `https://api.trnck.dev/ping`

An API to ping a URL or IP adress, accepts any URL
### GET Parameters
| Name | Description | Example |
|------|-------------|---------|
| url   | URL to ping | https://taskord.com |

### Example responce 
```json
{
  "status": "success",
  "result": {
    "miliseconds": 404,
    "code": 200
  }
}
```

## HTTP status mock API
A simle API for making the server respond with a certain status code

### GET Parameters
| Name | Type | Description | Example |
|------|------|-------------|---------|
| code | int | Status code to mock | 418 |

### Example request
[`https://api.trnck.dev/http/418`](https://api.trnck.dev/http/418)
