# SAM Rocket example in Snabbdom

This is my take on [SAM](http://sam.js.org/)'s [rocket example](http://sam.js.org/#samples),
using [snabbdom](https://github.com/paldepind/snabbdom).


## Diagram summary:

    State > Action > Model

    model -render-> state

    state -pureFn-> view

    state -nextAction-> action (can be auto-invoked)
      OR
    view  -userAction-> action

    action -present-> model


## Concepts definition:

![SAM diagram](SAM.png)

a VIEW as pure function of the model

each ACTION is a pure function, receiving optional parameters.  
valid actions should invoke modelPresent with an object defining the change intended to be applied to the model

the MODEL contains all application state and should not be tampered with directly.  
it exposes a single function, modelPresent, receiving the action intent.  
that function is responsible for accepting the action intent and if valid, change model internals.  
stateRender shall then be called, passing the model in for READING only.

STATE here does not hold state at all. more like a state machine.  
it exposes predicates based on model (state).  
is a pure function of the model (stateRender) which should:
* compute the next action predicate, that is, identify if the model shall trigger an action automatically or not
* decide how to translate the model into view (elect the best appropriate view fn)



## Files

The app is defined in `app.js`.  
The implementation of SAM is defined in `sam.js`.  
Browserify is being used in this branch to compile the app into `bundle.js`.
