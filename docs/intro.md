# Introcuction
Conduttore.js is a routing implementation for JavaScript apps.

## Motivations
A common approach to store user defined routes use a flat collection of regular expressions.
This kind of solutions leads to an efficient constant complexity of route contribution and not optimal `O(n)` complexity for the route resolving alghoritm, where `n` is the number of routes registered.

Conduttore.js key design decision is to have an algorithm that increase a bit more complexity in the contribution phase * (i.e. when we register a new route) in order to have a faster resolving phase (i.e. when we actually use the router).
This comes from the assumption that the contribution phase happens less often than the resolving phase. For the most common use the contribution phase happens only one time in the whole lifecycle of the application while the routing alghoritm runs quite often.

Conduttore.js stores the routes into a tree structure and implement algorithms with constant `O(1)`complexity for both contribution and resolving phases.

\* Despite the initial idea of increase 

## Features


## When not to use Conduttore.js
TBD