### Tests with Protractor test suite (v 4.0.9)

After running the Protractor test suite, the following are the supported
browsers / drivers. We support other drivers and browsers; however, since
the test suite checks only firefox and chrome, these are the only browsers
reported.

### Current supported browsers / drivers

| selenium standalone | firefox | chromedriver | chrome |
| ------------------- | ------- | ------------ | ------ |
| 2.53.1              | 47.0.1  | 2.24         | 53     |


### Investigated

| selenium standalone | firefox 47.0.1 | firefox 49.0.1 |
| ------------------- | -------------- | -------------- |
| 2.53.1              | pass           | fail           |
| 3.0.0               | fail           | fail           |
