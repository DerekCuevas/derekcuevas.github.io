---
title: "Using the Observer Design Pattern in Scala"
date: 2023-06-13T18:02:58.518Z
tags: ["scala","design patterns","observer design pattern"]
---


The Observer Design Pattern is a behavioral pattern that allows objects to notify other objects about their internal state changes. It defines a one-to-many dependency between objects, where a subject object maintains a list of its dependants (observers) and notifies them automatically on any state change. This pattern is widely used in various programming languages, as it provides a clear separation of concerns and facilitates communication between objects. In this post, we will explore how to implement the Observer Design Pattern in Scala.

## Overview
In the Observer Design Pattern, there are two main actors: the subject and the observer. The subject is the object we want to observe, and the observer is the object that will receive the notifications. The subject must register the observer and notify them when its internal state changes. The observer can then respond appropriately to the notification.

## Use Case
Consider the following use case: we have a scorecard class, which contains the scores of a sports game, and we want to notify the various interested parties of any changes to the score. The interested parties include the scoreboard, the live commentary, and the on-screen graphics. In this case, the scorecard is the subject, and the scoreboard, live commentary, and on-screen graphics are the observers.

### Implementing the Observer Pattern in Scala
The Observer Pattern can be implemented in Scala using traits and case classes. We'll start with the observer trait:

```Scala
trait Observer {
  def update(): Unit
}
```

The `Observer` trait specifies an abstract method `update()`, which will be implemented by the observers to handle the notifications.

Next, let's define the `Subject` trait:

```Scala
trait Subject {
  private var observers: List[Observer] = List()

  def register(observer: Observer): Unit =
    if(!observers.contains(observer)){
      observers = observer :: observers
    }

  def unregister(observer: Observer): Unit =
    if(observers.contains(observer)){
      observers = observers.filterNot(_ == observer)
    }

  def notifyObservers(): Unit =
    observers.foreach(_.update())
}
```

The `Subject` trait maintains a list of observers and provides methods to register, unregister, and notify them. `register` adds an observer to the list, `unregister` removes an observer from the list, and `notifyObservers` notifies all observers by calling their `update` method.

Next, let's define the scorecard case class:

```Scala
case class Scorecard(var homeTeamScore: Int, var awayTeamScore: Int) extends Subject {
  override def toString: String = s"Home team: $homeTeamScore, Away team: $awayTeamScore"

  def updateScores(homeTeamScore: Int, awayTeamScore: Int): Unit ={
    this.homeTeamScore = homeTeamScore
    this.awayTeamScore = awayTeamScore
    notifyObservers()
  }
}
```

The `Scorecard` case class extends the `Subject` trait, which allows it to maintain a list of observers. The `updateScores` method updates the scorecard's internal state and then notifies the observers by calling the `notifyObservers` method.

Finally, let's create the scoreboard, live commentary, and on-screen graphics classes that implement the `Observer` trait:

```Scala
case class Scoreboard() extends Observer {
  var homeTeamScore: Int = _
  var awayTeamScore: Int = _

  override def update(): Unit = println(s"Scoreboard updated: Home team $homeTeamScore, Away team $awayTeamScore")
}


case class LiveCommentary() extends Observer {
  var homeTeamScore: Int = _
  var awayTeamScore: Int = _

  override def update(): Unit = println(s"Live commentary updated: Home team $homeTeamScore, Away team $awayTeamScore")
}

case class OnScreenGraphics() extends Observer {
  var homeTeamScore: Int = _
  var awayTeamScore: Int = _

  override def update(): Unit = println(s"On-screen graphics updated: Home team $homeTeamScore, Away team $awayTeamScore")
}
```

The scoreboard, live commentary, and on-screen graphics classes implement the `update` method, which is called by the subject object when there is a change in the score. In this case, the implementation simply prints the updated scores to the console.

## Usage
Let's see the Observer Design Pattern in action:

```Scala
object ObserverApp extends App {
  val scorecard = Scorecard(0, 0)
  val scoreboard = Scoreboard()
  val liveCommentary = LiveCommentary()
  val onScreenGraphics = OnScreenGraphics()

  scorecard.register(scoreboard)
  scorecard.register(liveCommentary)
  scorecard.register(onScreenGraphics)

  scorecard.updateScores(1, 0)
  scorecard.unregister(onScreenGraphics)
  scorecard.updateScores(1, 1)
}
```

In this example, we create a new `Scorecard` object with an initial score of 0-0. We then create a new `Scoreboard`, `LiveCommentary`, and `OnScreenGraphics` object, and register them as observers with the `Scorecard` object by calling the `register` method. We then update the score to 1-0 by calling the `updateScores` method on the `Scorecard` object, which triggers a notification to all observers. We then unregister the `OnScreenGraphics` object as an observer by calling the `unregister` method, and update the score to 1-1, which triggers a notification to the remaining observers.

## Conclusion
The Observer Design Pattern is a powerful tool that can be used to model complex systems. In this post, we explored how to implement the Observer Pattern in Scala using traits and case classes. By using this pattern, we were able to cleanly separate the responsibilities between the subject and the observers, and facilitate communication between them.