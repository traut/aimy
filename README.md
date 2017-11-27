aimy ([demo](http://rawgithub.com/traut/aimy/master/index.html))
====

Create a list of accomplishments and track progress with a simple foldable stack UI

![Aimy screenshot](https://raw.githubusercontent.com/traut/aimy/master/aimy-screenshot.png)

How to work with aimy:
- create a file with your goals' tree structure in YAML format. Example:
```yaml
fitness:
    pushups:
        close pushups:
            value: 2x20
            goals: [1x5, 2x10, 2x20]
        uneven pushups:
            value: 2x15
            goals: [1x5, 2x10, 2x20]
    bridges:
        straight bridges:
            value: 3x40
            goals: [1x10, 2x30, 3x40]
        angled bridges:
            value: 3x30
            goals: [1x8, 2x15, 3x30]
```
([full configuration example](https://raw.githubusercontent.com/traut/aimy/master/goals.yaml))
- downloadn, adjust paths in index.html and open it in your favorite browser
